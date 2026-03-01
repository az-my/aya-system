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
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col gap-1 px-2 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-sidebar-foreground hover:text-primary"
          >
            <span className="text-lg font-bold text-primary">AYA</span>
          </Link>
          <span className="text-xs text-muted-foreground">Alih Daya</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
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
                  className="cursor-not-allowed opacity-70"
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="size-4" />
                      Lembur
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-normal text-muted-foreground"
                    >
                      COMING SOON
                    </Badge>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
