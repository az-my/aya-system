"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Plus, Search, FileText, Pencil, Trash2, Filter, Loader2,
  Car, Calendar, Clock, Users, MapPin, Download,
} from "lucide-react"
import { motion } from "motion/react"
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"
import { PageWrapper } from "@/components/page-wrapper"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Driver, Trip, SPPDConfig } from "@/lib/pdf/types"
import { formatRupiah, getMonthName } from "@/lib/pdf/utils"
import {
  generateSPPDIndividual,
  generateRincianPenetapan,
  generateRekapBayar,
} from "@/lib/pdf/generate"

const RATE_KONSUMSI = 150_000
const RATE_PENGINAPAN = 250_000

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1),
}))
const YEARS = [2024, 2025, 2026, 2027]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-[#FF0033]/10 text-[#CC0026]",
    completed: "bg-emerald-50 text-emerald-700",
    pending: "bg-[#F9F9F9] text-[#606060] border border-[#E5E5E5]",
  }
  const labels: Record<string, string> = {
    active: "Berjalan",
    completed: "Selesai",
    pending: "Menunggu",
  }
  const today = new Date().toISOString().split("T")[0]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  )
}

function getTripStatus(tanggal_awal: string, tanggal_akhir: string): string {
  const today = new Date().toISOString().split("T")[0]
  if (today < tanggal_awal) return "pending"
  if (today > tanggal_akhir) return "completed"
  return "active"
}

interface TripFormData {
  driver_id: string
  uraian_kegiatan: string
  tujuan: string
  kendaraan: string
  tanggal_awal: string
  tanggal_akhir: string
  jumlah_hari_penginapan: number
  unit_kerja: string
}

const defaultForm: TripFormData = {
  driver_id: "",
  uraian_kegiatan: "",
  tujuan: "",
  kendaraan: "Kendaraan Dinas",
  tanggal_awal: "",
  tanggal_akhir: "",
  jumlah_hari_penginapan: 0,
  unit_kerja: "",
}

export default function PerjalananPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [config, setConfig] = useState<SPPDConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBulan, setSelectedBulan] = useState(currentMonth)
  const [selectedTahun, setSelectedTahun] = useState(currentYear)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<TripFormData>(defaultForm)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [tripsRes, driversRes, configRes] = await Promise.all([
      supabase
        .from("trips")
        .select("*, driver:drivers(id, nama, unit, tipe)")
        .eq("periode_bulan", selectedBulan)
        .eq("periode_tahun", selectedTahun)
        .order("tanggal_awal", { ascending: true }),
      supabase
        .from("drivers")
        .select("id, nama, unit, tipe")
        .eq("aktif", true)
        .order("nama"),
      supabase.from("sppd_config").select("*").limit(1).single(),
    ])

    if (tripsRes.data) {
      const mapped: Trip[] = tripsRes.data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        driver: row.driver as Driver,
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
      }))
      setTrips(mapped)
    }

    if (driversRes.data) {
      setDrivers(driversRes.data as Driver[])
    }

    if (configRes.data) {
      const c = configRes.data
      setConfig({
        company_name: c.company_name,
        company_city: c.company_city,
        signatory_name: c.signatory_name,
        signatory_title: c.signatory_title,
        supervisor_name: c.supervisor_name,
        supervisor_title: c.supervisor_title,
        tempat_berangkat: c.tempat_berangkat,
      })
    }

    setLoading(false)
  }, [selectedBulan, selectedTahun])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredTrips = useMemo(() => {
    if (!search) return trips
    const q = search.toLowerCase()
    return trips.filter(
      (t) =>
        t.driver.nama.toLowerCase().includes(q) ||
        t.tujuan.toLowerCase().includes(q) ||
        t.uraian_kegiatan.toLowerCase().includes(q)
    )
  }, [trips, search])

  const jumlahHari = useMemo(() => {
    if (!form.tanggal_awal || !form.tanggal_akhir) return 0
    const start = new Date(form.tanggal_awal)
    const end = new Date(form.tanggal_akhir)
    const diff = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
    return diff > 0 ? diff : 0
  }, [form.tanggal_awal, form.tanggal_akhir])

  const costPreview = useMemo(() => {
    const konsumsi = jumlahHari * RATE_KONSUMSI
    const restitusi = form.jumlah_hari_penginapan * RATE_PENGINAPAN
    return { konsumsi, restitusi, total: konsumsi + restitusi }
  }, [jumlahHari, form.jumlah_hari_penginapan])

  const stats = useMemo(() => {
    const totalTrips = trips.length
    const totalHari = trips.reduce((s, t) => s + t.jumlah_hari, 0)
    const uniqueDrivers = new Set(trips.map((t) => t.driver.id)).size
    const totalBayar = trips.reduce(
      (s, t) =>
        s + t.jumlah_hari * RATE_KONSUMSI + t.jumlah_hari_penginapan * RATE_PENGINAPAN,
      0
    )
    return { totalTrips, totalHari, uniqueDrivers, totalBayar }
  }, [trips])

  function openAddDialog() {
    setEditingTrip(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  function openEditDialog(trip: Trip) {
    setEditingTrip(trip)
    setForm({
      driver_id: trip.driver.id,
      uraian_kegiatan: trip.uraian_kegiatan,
      tujuan: trip.tujuan,
      kendaraan: trip.kendaraan,
      tanggal_awal: trip.tanggal_awal,
      tanggal_akhir: trip.tanggal_akhir,
      jumlah_hari_penginapan: trip.jumlah_hari_penginapan,
      unit_kerja: trip.unit_kerja,
    })
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!form.driver_id || !form.uraian_kegiatan || !form.tujuan || !form.tanggal_awal || !form.tanggal_akhir) {
      toast.error("Mohon lengkapi semua field yang wajib diisi.")
      return
    }
    if (jumlahHari <= 0) {
      toast.error("Tanggal akhir harus sama atau setelah tanggal awal.")
      return
    }

    setSubmitting(true)
    const payload = {
      driver_id: form.driver_id,
      uraian_kegiatan: form.uraian_kegiatan,
      tujuan: form.tujuan,
      kendaraan: form.kendaraan,
      tanggal_awal: form.tanggal_awal,
      tanggal_akhir: form.tanggal_akhir,
      jumlah_hari: jumlahHari,
      jumlah_hari_penginapan: form.jumlah_hari_penginapan,
      unit_kerja: form.unit_kerja,
      periode_bulan: selectedBulan,
      periode_tahun: selectedTahun,
      updated_at: new Date().toISOString(),
    }

    if (editingTrip) {
      const { error } = await supabase.from("trips").update(payload).eq("id", editingTrip.id)
      if (error) {
        toast.error("Gagal memperbarui perjalanan: " + error.message)
      } else {
        toast.success("Perjalanan berhasil diperbarui.")
        setDialogOpen(false)
        fetchData()
      }
    } else {
      const { error } = await supabase.from("trips").insert(payload)
      if (error) {
        toast.error("Gagal menambah perjalanan: " + error.message)
      } else {
        toast.success("Perjalanan berhasil ditambahkan.")
        setDialogOpen(false)
        fetchData()
      }
    }
    setSubmitting(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    const { error } = await supabase.from("trips").delete().eq("id", deleteId)
    if (error) {
      toast.error("Gagal menghapus: " + error.message)
    } else {
      toast.success("Perjalanan dihapus.")
      fetchData()
    }
    setDeleteId(null)
  }

  async function handleCetakSPPD(trip: Trip) {
    if (!config) return
    setGeneratingPDF(trip.id)
    try {
      await generateSPPDIndividual(trip, config)
      toast.success("SPPD berhasil dibuat.")
    } catch {
      toast.error("Gagal membuat PDF SPPD.")
    }
    setGeneratingPDF(null)
  }

  async function handleCetakRincian() {
    if (!config || trips.length === 0) {
      toast.error("Tidak ada data perjalanan.")
      return
    }
    setGeneratingPDF("rincian")
    try {
      await generateRincianPenetapan(trips, config, selectedBulan, selectedTahun)
      toast.success("Rincian Penetapan berhasil dibuat.")
    } catch {
      toast.error("Gagal membuat PDF Rincian.")
    }
    setGeneratingPDF(null)
  }

  async function handleCetakRekap() {
    if (!config || trips.length === 0) {
      toast.error("Tidak ada data perjalanan.")
      return
    }
    setGeneratingPDF("rekap")
    try {
      await generateRekapBayar(trips, config, selectedBulan, selectedTahun)
      toast.success("Rekap Bayar berhasil dibuat.")
    } catch {
      toast.error("Gagal membuat PDF Rekap.")
    }
    setGeneratingPDF(null)
  }

  function handleDriverChange(driverId: string) {
    const d = drivers.find((dr) => dr.id === driverId)
    setForm((f) => ({
      ...f,
      driver_id: driverId,
      unit_kerja: d?.unit ?? f.unit_kerja,
    }))
  }

  return (
    <PageWrapper>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F0F0F]">
              Perjalanan Dinas
            </h1>
            <p className="mt-1 text-sm text-[#606060]">
              SPPD PT. Palma Nafindo Pratama
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(selectedBulan)}
              onValueChange={(v) => setSelectedBulan(Number(v))}
            >
              <SelectTrigger className="w-[140px] border-[#E5E5E5]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(selectedTahun)}
              onValueChange={(v) => setSelectedTahun(Number(v))}
            >
              <SelectTrigger className="w-[100px] border-[#E5E5E5]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={openAddDialog}
              className="bg-[#FF0033] hover:bg-[#CC0026] text-white gap-2"
            >
              <Plus className="size-4" />
              Tambah Perjalanan
            </Button>
            <Button
              variant="outline"
              onClick={handleCetakRincian}
              disabled={!!generatingPDF || trips.length === 0}
              className="gap-2 border-[#E5E5E5] text-[#606060] hover:bg-[#F2F2F2]"
            >
              {generatingPDF === "rincian" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Cetak Rincian
            </Button>
            <Button
              variant="outline"
              onClick={handleCetakRekap}
              disabled={!!generatingPDF || trips.length === 0}
              className="gap-2 border-[#E5E5E5] text-[#606060] hover:bg-[#F2F2F2]"
            >
              {generatingPDF === "rekap" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Cetak Rekap Bayar
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Perjalanan",
              value: stats.totalTrips,
              icon: Car,
            },
            {
              title: "Total Hari SPPD",
              value: stats.totalHari,
              suffix: "hari",
              icon: Calendar,
            },
            {
              title: "Total Driver",
              value: stats.uniqueDrivers,
              icon: Users,
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 3 * 0.06 }}
          >
            <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#606060] font-medium">Total Dibayarkan</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-[#0F0F0F] tabular-nums">
                        {formatRupiah(stats.totalBayar)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-[#FF0033]/10">
                      <Clock className="size-5 text-[#FF0033]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trips Table */}
        <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-4 py-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#606060]" />
                <Input
                  placeholder="Cari pengemudi, tujuan, kegiatan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <span className="text-xs text-[#606060]">
                {filteredTrips.length} perjalanan
              </span>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Car className="size-12 text-[#E5E5E5]" />
                <p className="text-sm text-[#606060]">
                  Belum ada perjalanan untuk periode ini.
                </p>
                <Button
                  onClick={openAddDialog}
                  className="bg-[#FF0033] hover:bg-[#CC0026] text-white gap-2 mt-2"
                >
                  <Plus className="size-4" />
                  Tambah Perjalanan
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                      <th className="px-4 py-3 text-left font-medium text-[#606060] w-10">No</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Pengemudi</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Unit</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Kegiatan</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Tujuan</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Tgl Awal</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Tgl Akhir</th>
                      <th className="px-4 py-3 text-center font-medium text-[#606060]">Hari</th>
                      <th className="px-4 py-3 text-center font-medium text-[#606060]">Inap</th>
                      <th className="px-4 py-3 text-right font-medium text-[#606060]">Total Rp</th>
                      <th className="px-4 py-3 text-left font-medium text-[#606060]">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-[#606060]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip, i) => {
                      const total =
                        trip.jumlah_hari * RATE_KONSUMSI +
                        trip.jumlah_hari_penginapan * RATE_PENGINAPAN
                      const status = getTripStatus(trip.tanggal_awal, trip.tanggal_akhir)
                      return (
                        <motion.tr
                          key={trip.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15, delay: i * 0.02 }}
                          className={`border-b border-[#E5E5E5] last:border-0 hover:bg-[#F2F2F2] transition-colors ${
                            status === "active"
                              ? "border-l-[3px] border-l-[#FF0033]"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-[#606060]">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-[#0F0F0F]">
                            {trip.driver.nama}
                          </td>
                          <td className="px-4 py-3 text-[#606060]">{trip.driver.unit}</td>
                          <td className="px-4 py-3 text-[#606060] max-w-[200px] truncate">
                            {trip.uraian_kegiatan}
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-[#0F0F0F]">
                              <MapPin className="size-3 text-[#FF0033]" />
                              {trip.tujuan}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#606060] tabular-nums">
                            {trip.tanggal_awal}
                          </td>
                          <td className="px-4 py-3 text-[#606060] tabular-nums">
                            {trip.tanggal_akhir}
                          </td>
                          <td className="px-4 py-3 text-center tabular-nums text-[#0F0F0F]">
                            {trip.jumlah_hari}
                          </td>
                          <td className="px-4 py-3 text-center tabular-nums text-[#0F0F0F]">
                            {trip.jumlah_hari_penginapan}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-[#0F0F0F] font-medium">
                            {formatRupiah(total)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => handleCetakSPPD(trip)}
                                disabled={!!generatingPDF}
                                title="Cetak SPPD"
                                className="text-[#FF0033] hover:bg-[#FF0033]/5"
                              >
                                {generatingPDF === trip.id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <FileText className="size-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => openEditDialog(trip)}
                                title="Edit"
                                className="text-[#606060] hover:text-[#0F0F0F]"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setDeleteId(trip.id)}
                                title="Hapus"
                                className="text-[#606060] hover:text-red-600"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0F0F0F]">
              {editingTrip ? "Edit Perjalanan" : "Tambah Perjalanan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#0F0F0F]">
                Pengemudi *
              </Label>
              <Select value={form.driver_id} onValueChange={handleDriverChange}>
                <SelectTrigger className="border-[#E5E5E5]">
                  <SelectValue placeholder="Pilih pengemudi" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nama} — {d.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#0F0F0F]">
                Uraian Kegiatan *
              </Label>
              <Textarea
                value={form.uraian_kegiatan}
                onChange={(e) =>
                  setForm((f) => ({ ...f, uraian_kegiatan: e.target.value }))
                }
                placeholder="Deskripsi kegiatan perjalanan dinas"
                className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Tujuan *
                </Label>
                <Input
                  value={form.tujuan}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tujuan: e.target.value }))
                  }
                  placeholder="Kota tujuan"
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Kendaraan
                </Label>
                <Input
                  value={form.kendaraan}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kendaraan: e.target.value }))
                  }
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Tanggal Awal *
                </Label>
                <Input
                  type="date"
                  value={form.tanggal_awal}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tanggal_awal: e.target.value }))
                  }
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Tanggal Akhir *
                </Label>
                <Input
                  type="date"
                  value={form.tanggal_akhir}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tanggal_akhir: e.target.value }))
                  }
                  min={form.tanggal_awal}
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Jumlah Hari
                </Label>
                <Input
                  type="number"
                  value={jumlahHari}
                  readOnly
                  className="border-[#E5E5E5] bg-[#F9F9F9] text-[#0F0F0F]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Hari Penginapan
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.jumlah_hari_penginapan}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      jumlah_hari_penginapan: Math.max(
                        0,
                        parseInt(e.target.value) || 0
                      ),
                    }))
                  }
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#0F0F0F]">
                  Unit Kerja
                </Label>
                <Input
                  value={form.unit_kerja}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unit_kerja: e.target.value }))
                  }
                  className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
            </div>

            {/* Cost Preview */}
            <div className="rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] p-4 space-y-2">
              <p className="text-xs font-medium text-[#606060] uppercase tracking-wider">
                Pratinjau Biaya
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-[#606060]">Uang Konsumsi ({jumlahHari} hari × Rp 150.000)</span>
                <span className="text-[#0F0F0F] tabular-nums font-medium">
                  {formatRupiah(costPreview.konsumsi)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#606060]">
                  Restitusi ({form.jumlah_hari_penginapan} hari × Rp 250.000)
                </span>
                <span className="text-[#0F0F0F] tabular-nums font-medium">
                  {formatRupiah(costPreview.restitusi)}
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-2 flex justify-between text-sm font-semibold">
                <span className="text-[#0F0F0F]">Total</span>
                <span className="text-[#FF0033] tabular-nums">
                  {formatRupiah(costPreview.total)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-[#E5E5E5] hover:bg-[#F2F2F2]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#FF0033] hover:bg-[#CC0026] text-white gap-2"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editingTrip ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#0F0F0F]">
              Hapus Perjalanan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#606060]">
              Hapus perjalanan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5E5E5] hover:bg-[#F2F2F2]">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  )
}
