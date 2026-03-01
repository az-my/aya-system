"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Phone, Mail } from "lucide-react"
import { motion } from "motion/react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const drivers = [
  { id: 1, name: "Budi Santoso", phone: "081234567890", email: "budi@aya.id", status: "active", trips: 24 },
  { id: 2, name: "Ahmad Fauzi", phone: "081234567891", email: "ahmad@aya.id", status: "active", trips: 18 },
  { id: 3, name: "Rudi Hartono", phone: "081234567892", email: "rudi@aya.id", status: "inactive", trips: 31 },
  { id: 4, name: "Dedi Kurniawan", phone: "081234567893", email: "dedi@aya.id", status: "active", trips: 12 },
  { id: 5, name: "Eko Prasetyo", phone: "081234567894", email: "eko@aya.id", status: "active", trips: 27 },
  { id: 6, name: "Fajar Ramadhan", phone: "081234567895", email: "fajar@aya.id", status: "pending", trips: 0 },
  { id: 7, name: "Gunawan Wibowo", phone: "081234567896", email: "gunawan@aya.id", status: "active", trips: 15 },
  { id: 8, name: "Hendra Saputra", phone: "081234567897", email: "hendra@aya.id", status: "inactive", trips: 9 },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-[#FF0033]/10 text-[#CC0026]",
    inactive: "bg-[#F2F2F2] text-[#606060]",
    pending: "bg-[#F9F9F9] text-[#606060] border border-[#E5E5E5]",
  }
  const labels: Record<string, string> = {
    active: "Aktif",
    inactive: "Nonaktif",
    pending: "Menunggu",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  )
}

export default function PengemudiPage() {
  const [search, setSearch] = useState("")
  const filtered = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F0F0F]">Pengemudi</h1>
            <p className="mt-1 text-sm text-[#606060]">
              Kelola data pengemudi tenaga alih daya.
            </p>
          </div>
          <Button className="bg-[#FF0033] hover:bg-[#CC0026] text-white gap-2 w-fit">
            <Plus className="size-4" />
            Tambah Pengemudi
          </Button>
        </div>

        <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-4 py-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#606060]" />
                <Input
                  placeholder="Cari pengemudi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                />
              </div>
              <span className="text-xs text-[#606060]">
                {filtered.length} pengemudi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Nama</th>
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Kontak</th>
                    <th className="px-4 py-3 text-left font-medium text-[#606060]">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-[#606060]">Perjalanan</th>
                    <th className="px-4 py-3 text-right font-medium text-[#606060]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((driver, i) => (
                    <motion.tr
                      key={driver.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F2F2F2] transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-full bg-[#F2F2F2] text-[#0F0F0F] font-medium text-xs">
                            {driver.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-[#0F0F0F]">{driver.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-[#606060]">
                            <Phone className="size-3" /> {driver.phone}
                          </span>
                          <span className="flex items-center gap-1.5 text-[#606060]">
                            <Mail className="size-3" /> {driver.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={driver.status} />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#0F0F0F]">
                        {driver.trips}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#606060] hover:text-[#0F0F0F]">
                          <MoreHorizontal className="size-4" />
                        </Button>
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
