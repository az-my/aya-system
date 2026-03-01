"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number"

interface StatCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  icon: LucideIcon
  description?: string
  trend?: { value: number; positive: boolean }
}

export function StatCard({
  title,
  value,
  suffix,
  prefix,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card className="border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#606060] font-medium">{title}</span>
            <div className="flex items-baseline gap-1">
              {prefix && (
                <span className="text-2xl font-semibold text-[#0F0F0F]">
                  {prefix}
                </span>
              )}
              <CountingNumber
                number={value}
                className="text-2xl font-semibold text-[#0F0F0F] tabular-nums"
                transition={{ stiffness: 80, damping: 40 }}
                inViewOnce
              />
              {suffix && (
                <span className="text-sm text-[#606060] font-medium ml-0.5">
                  {suffix}
                </span>
              )}
            </div>
            {description && (
              <span className="text-xs text-[#606060] mt-1">{description}</span>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center justify-center size-10 rounded-lg bg-[#FF0033]/10">
              <Icon className="size-5 text-[#FF0033]" />
            </div>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
