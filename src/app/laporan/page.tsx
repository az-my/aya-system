"use client"

import { useState } from "react"
import { Search, Download, FileText, Calendar, Filter, TrendingUp, Clock } from "lucide-react"
import { motion } from "motion/react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number"

const summaryStats = [
  { label: "Total SPPD", value: 56, icon: FileText },
  { label: "Perjalanan Aktif", value: 12, icon: TrendingUp },
  { label: "Rata-rata Durasi", value: 3, suffix: "hari", icon: Clock },
]

const reports = [
  { id: "RPT-001", title: "Laporan SPPD Bulanan - Februari 2026", type: "Bulanan", date: "01 Mar 2026", status: "ready" },
  { id: "RPT-002", title: "Rekapitulasi Pengemudi Q1 2026", type: "Kuartal", date: "28 Feb 2026", status: "ready" },
  { id: "RPT-003", title: "Laporan Biaya Perjalanan - Februari 2026", type: "Bulanan", date: "28 Feb 2026", status: "processing" },
  { id: "RPT-004", title: "Statistik Rute Populer", type: "Analitik", date: "27 Feb 2026", status: "ready" },
  { id: "RPT-005", title: "Laporan SPPD Bulanan - Januari 2026", type: "Bulanan", date: "01 Feb 2026", status: "ready" },
  { id: "RPT-006", title: "Laporan Lembur - Januari 2026", type: "Bulanan", date: "01 Feb 2026", status: "ready" },
]

function ReportStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ready: "bg-emerald-50 text-emerald-700",
    processing: "bg-[#FF0033]/10 text-[#CC0026]",
    error: "bg-[#F2F2F2] text-[#606060]",
  }
  const labels: Record<string, string> = {
    ready: "Siap",
    processing: "Diproses",
    error: "Gagal",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.error}`}>
      {labels[status] ?? status}
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F9F9F9] px-2.5 py-0.5 text-xs font-medium text-[#606060] border border-[#E5E5E5]">
      {type}
    </span>
  )
}

export default function LaporanPage() {
  const [search, setSearch] = useState("")
  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F0F0F]">Laporan</h1>
            <p className="mt-1 text-sm text-[#606060]">
              Lihat dan unduh laporan operasional.
            </p>
          </div>
          <Button className="bg-[#FF0033] hover:bg-[#CC0026] text-white gap-2 w-fit">
            <Download className="size-4" />
            Ekspor Semua
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summaryStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
              >
                <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-[#FF0033]/10">
                      <Icon className="size-5 text-[#FF0033]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#606060]">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <CountingNumber
                          number={stat.value}
                          className="text-xl font-semibold text-[#0F0F0F] tabular-nums"
                          transition={{ stiffness: 80, damping: 40 }}
                          inViewOnce
                        />
                        {stat.suffix && (
                          <span className="text-sm text-[#606060]">{stat.suffix}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-0 px-4 pt-4">
            <CardTitle className="text-lg font-semibold text-[#0F0F0F]">
              Daftar Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="flex items-center gap-3 border-b border-t border-[#E5E5E5] px-4 py-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#606060]" />
                <Input
                  placeholder="Cari laporan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-[#E5E5E5] text-[#606060] hover:bg-[#F2F2F2]">
                <Filter className="size-3.5" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Laporan</th>
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Tipe</th>
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-[#606060]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report, i) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F2F2F2] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-[#606060]" />
                          <span className="font-medium text-[#0F0F0F]">{report.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <TypeBadge type={report.type} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-[#606060]">
                          <Calendar className="size-3" />
                          {report.date}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ReportStatusBadge status={report.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {report.status === "ready" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-[#FF0033] hover:text-[#CC0026] hover:bg-[#FF0033]/5"
                          >
                            <Download className="size-3.5" />
                            Unduh
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
