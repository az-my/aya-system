"use client"

import { Users, Car, FileText, Clock } from "lucide-react"
import { motion } from "motion/react"
import { PageWrapper } from "@/components/page-wrapper"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "Total Pengemudi",
    value: 128,
    icon: Users,
    description: "Aktif bulan ini",
    trend: { value: 4.2, positive: true },
  },
  {
    title: "Perjalanan Aktif",
    value: 34,
    icon: Car,
    description: "Sedang berjalan",
    trend: { value: 12, positive: true },
  },
  {
    title: "Laporan Bulan Ini",
    value: 56,
    icon: FileText,
    description: "SPPD selesai",
    trend: { value: 2.1, positive: false },
  },
  {
    title: "Jam Lembur",
    value: 312,
    suffix: "jam",
    icon: Clock,
    description: "Total akumulasi",
    trend: { value: 8.5, positive: true },
  },
]

const recentTrips = [
  { id: "SPPD-001", driver: "Budi Santoso", destination: "Surabaya", status: "active" },
  { id: "SPPD-002", driver: "Ahmad Fauzi", destination: "Bandung", status: "completed" },
  { id: "SPPD-003", driver: "Rudi Hartono", destination: "Semarang", status: "active" },
  { id: "SPPD-004", driver: "Dedi Kurniawan", destination: "Yogyakarta", status: "pending" },
  { id: "SPPD-005", driver: "Eko Prasetyo", destination: "Malang", status: "completed" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-[#FF0033]/10 text-[#CC0026]",
    completed: "bg-emerald-50 text-emerald-700",
    pending: "bg-[#F9F9F9] text-[#606060] border border-[#E5E5E5]",
  }
  const labels: Record<string, string> = {
    active: "Aktif",
    completed: "Selesai",
    pending: "Menunggu",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  )
}

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F0F0F]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#606060]">
            Ringkasan operasional sistem manajemen tenaga alih daya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#0F0F0F]">
                    Perjalanan Terbaru
                  </CardTitle>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#FF0033] hover:bg-[#CC0026] text-white text-xs"
                  >
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                        <th className="px-4 py-3 text-left font-medium text-[#606060]">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-[#606060]">
                          Pengemudi
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-[#606060]">
                          Tujuan
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-[#606060]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrips.map((trip, i) => (
                        <motion.tr
                          key={trip.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.35 + i * 0.04 }}
                          className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F2F2F2] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[#0F0F0F]">
                            {trip.id}
                          </td>
                          <td className="px-4 py-3 text-[#0F0F0F]">
                            {trip.driver}
                          </td>
                          <td className="px-4 py-3 text-[#606060]">
                            {trip.destination}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={trip.status} />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35 }}
          >
            <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#0F0F0F]">
                  Aktivitas Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button className="w-full justify-start gap-3 bg-[#FF0033] hover:bg-[#CC0026] text-white">
                  <Car className="size-4" />
                  Buat SPPD Baru
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-[#E5E5E5] text-[#0F0F0F] hover:bg-[#F2F2F2]"
                >
                  <Users className="size-4" />
                  Tambah Pengemudi
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-[#E5E5E5] text-[#0F0F0F] hover:bg-[#F2F2F2]"
                >
                  <FileText className="size-4" />
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
