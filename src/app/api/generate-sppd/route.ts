import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createElement } from "react"
import { renderToFile } from "@react-pdf/renderer"
import path from "path"
import fs from "fs"
import { SPPDIndividualDoc } from "@/lib/pdf/sppd-individual"
import { calculateCosts } from "@/lib/pdf/utils"
import type { Trip, SPPDConfig } from "@/lib/pdf/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const tripId = request.nextUrl.searchParams.get("tripId")
  if (!tripId) {
    return NextResponse.json({ error: "tripId required" }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: tripRow, error: tripErr } = await supabase
    .from("trips")
    .select("*, driver:drivers(id, nama, unit, tipe)")
    .eq("id", tripId)
    .single()

  if (tripErr || !tripRow) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 })
  }

  const { data: configRow, error: configErr } = await supabase
    .from("sppd_config")
    .select("*")
    .limit(1)
    .single()

  if (configErr || !configRow) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 })
  }

  const driver = tripRow.driver as { id: string; nama: string; unit: string; tipe: string }
  const trip: Trip = {
    id: tripRow.id,
    driver: {
      id: driver.id,
      nama: driver.nama,
      unit: driver.unit ?? "",
      tipe: driver.tipe ?? "Driver",
    },
    uraian_kegiatan: tripRow.uraian_kegiatan,
    tujuan: tripRow.tujuan,
    kendaraan: tripRow.kendaraan ?? "Kendaraan Dinas",
    tanggal_awal: tripRow.tanggal_awal,
    tanggal_akhir: tripRow.tanggal_akhir,
    jumlah_hari: tripRow.jumlah_hari,
    jumlah_hari_penginapan: tripRow.jumlah_hari_penginapan ?? 0,
    unit_kerja: tripRow.unit_kerja ?? "",
    periode_bulan: tripRow.periode_bulan,
    periode_tahun: tripRow.periode_tahun,
  }

  const config: SPPDConfig = {
    company_name: configRow.company_name ?? "",
    company_city: configRow.company_city ?? "",
    signatory_name: configRow.signatory_name ?? "",
    signatory_title: configRow.signatory_title ?? "",
    supervisor_name: configRow.supervisor_name ?? "",
    supervisor_title: configRow.supervisor_title ?? "",
    tempat_berangkat: configRow.tempat_berangkat ?? "",
  }

  const tripWithCosts = calculateCosts(trip)
  const doc = createElement(SPPDIndividualDoc, {
    trips: [tripWithCosts],
    config,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const outDir = path.join(process.cwd(), "pdf-test-output")
  const outPath = path.join(outDir, "SPPD_visual_review.pdf")

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
