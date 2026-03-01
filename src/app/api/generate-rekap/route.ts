import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createElement } from "react"
import { renderToFile } from "@react-pdf/renderer"
import path from "path"
import fs from "fs"
import { RekapBayarDoc } from "@/lib/pdf/rekap-bayar"
import { calculateCosts } from "@/lib/pdf/utils"
import type { Trip, SPPDConfig } from "@/lib/pdf/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function mapTripRow(row: Record<string, unknown>): Trip {
  const driver = row.driver as { id: string; nama: string; unit: string; tipe: string }
  return {
    id: row.id as string,
    driver: {
      id: driver.id,
      nama: driver.nama,
      unit: driver.unit ?? "",
      tipe: driver.tipe ?? "Driver",
    },
    uraian_kegiatan: row.uraian_kegiatan as string,
    tujuan: row.tujuan as string,
    kendaraan: (row.kendaraan as string) ?? "Kendaraan Dinas",
    tanggal_awal: row.tanggal_awal as string,
    tanggal_akhir: row.tanggal_akhir as string,
    jumlah_hari: row.jumlah_hari as number,
    jumlah_hari_penginapan: (row.jumlah_hari_penginapan as number) ?? 0,
    unit_kerja: (row.unit_kerja as string) ?? "",
    periode_bulan: row.periode_bulan as number,
    periode_tahun: row.periode_tahun as number,
  }
}

export async function GET(request: NextRequest) {
  const bulan = parseInt(request.nextUrl.searchParams.get("bulan") ?? "1", 10)
  const tahun = parseInt(request.nextUrl.searchParams.get("tahun") ?? "2026", 10)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: tripRows, error: tripErr } = await supabase
    .from("trips")
    .select("*, driver:drivers(id, nama, unit, tipe)")
    .eq("periode_bulan", bulan)
    .eq("periode_tahun", tahun)
    .order("tanggal_awal", { ascending: true })

  if (tripErr || !tripRows?.length) {
    return NextResponse.json(
      { error: "No trips found for period" },
      { status: 404 }
    )
  }

  const { data: configRow, error: configErr } = await supabase
    .from("sppd_config")
    .select("*")
    .limit(1)
    .single()

  if (configErr || !configRow) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 })
  }

  const trips = tripRows.map(mapTripRow)
  const config: SPPDConfig = {
    company_name: configRow.company_name ?? "",
    company_city: configRow.company_city ?? "",
    signatory_name: configRow.signatory_name ?? "",
    signatory_title: configRow.signatory_title ?? "",
    supervisor_name: configRow.supervisor_name ?? "",
    supervisor_title: configRow.supervisor_title ?? "",
    tempat_berangkat: configRow.tempat_berangkat ?? "",
  }

  const tripsWithCosts = trips.map(calculateCosts)
  const doc = createElement(RekapBayarDoc, {
    trips: tripsWithCosts,
    config,
    bulan,
    tahun,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const outDir = path.join(process.cwd(), "pdf-test-output")
  const outPath = path.join(outDir, "Rekap_v3.pdf")

  try {
    fs.mkdirSync(outDir, { recursive: true })
    await renderToFile(doc, outPath)
    return NextResponse.json({
      success: true,
      path: outPath,
    })
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    )
  }
}
