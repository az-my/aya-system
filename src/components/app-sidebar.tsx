"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Settings,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Pengemudi", href: "/pengemudi", icon: Users },
  { title: "Perjalanan", href: "/perjalanan", icon: Car },
  { title: "Laporan", href: "/laporan", icon: FileText },
  { title: "Pengaturan", href: "/pengaturan", icon: Settings },
]

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#FF0033]">A</span>
            <span className="text-[#0F0F0F]">Y</span>
            <span className="text-[#FF0033]">A</span>
          </span>
          <span className="text-xs text-[#606060] group-data-[collapsible=icon]:hidden">
            Alih Daya
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#606060] text-xs uppercase tracking-wider font-medium">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-[#F2F2F2] text-[#0F0F0F] font-medium [&>svg]:text-[#FF0033]"
                          : "text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F]"
                      }
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  disabled
                  className="cursor-not-allowed opacity-60 text-[#606060]"
                  tooltip="Lembur"
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="size-4" />
                      Lembur
                    </span>
                    <Badge className="text-[10px] font-normal bg-[#FF0033]/10 text-[#CC0026] border-0">
                      SOON
                    </Badge>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="text-[10px] text-[#606060] group-data-[collapsible=icon]:hidden">
          v0.1.0
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
