"use client"

import { Building2, Bell, Shield, Globe } from "lucide-react"
import { motion } from "motion/react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const settingsSections = [
  {
    icon: Building2,
    title: "Profil Perusahaan",
    description: "Informasi dasar perusahaan dan kontak.",
    fields: [
      { label: "Nama Perusahaan", placeholder: "PT. AYA Indonesia", type: "text" },
      { label: "Alamat", placeholder: "Jl. Sudirman No. 123, Jakarta", type: "text" },
      { label: "Email", placeholder: "admin@aya.id", type: "email" },
      { label: "Telepon", placeholder: "+62 21 1234567", type: "tel" },
    ],
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description: "Atur preferensi notifikasi sistem.",
    fields: [
      { label: "Email Notifikasi", placeholder: "notif@aya.id", type: "email" },
    ],
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Pengaturan keamanan dan akses.",
    fields: [
      { label: "Password Lama", placeholder: "••••••••", type: "password" },
      { label: "Password Baru", placeholder: "••••••••", type: "password" },
      { label: "Konfirmasi Password", placeholder: "••••••••", type: "password" },
    ],
  },
  {
    icon: Globe,
    title: "Regional",
    description: "Pengaturan zona waktu dan bahasa.",
    fields: [
      { label: "Zona Waktu", placeholder: "Asia/Jakarta (WIB)", type: "text" },
      { label: "Bahasa", placeholder: "Bahasa Indonesia", type: "text" },
    ],
  },
]

export default function PengaturanPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F0F0F]">Pengaturan</h1>
          <p className="mt-1 text-sm text-[#606060]">
            Kelola konfigurasi sistem dan preferensi.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-3xl">
          {settingsSections.map((section, i) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
              >
                <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-9 rounded-lg bg-[#FF0033]/10">
                        <Icon className="size-4 text-[#FF0033]" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-[#0F0F0F]">
                          {section.title}
                        </CardTitle>
                        <p className="text-xs text-[#606060] mt-0.5">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator className="bg-[#E5E5E5]" />
                  <CardContent className="pt-4 pb-5 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.label} className="space-y-1.5">
                        <Label className="text-sm font-medium text-[#0F0F0F]">
                          {field.label}
                        </Label>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="border-[#E5E5E5] focus-visible:ring-[#FF0033]/30 focus-visible:border-[#FF0033]"
                        />
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <Button className="bg-[#FF0033] hover:bg-[#CC0026] text-white">
                        Simpan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
