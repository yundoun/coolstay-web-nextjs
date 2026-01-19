"use client"

import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps {
  size?: "sm" | "md"
  className?: string
}

export function PremiumBadge({ size = "md", className }: PremiumBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
        "shadow-sm",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <Crown className={cn(size === "sm" ? "size-3" : "size-3.5")} />
      <span>프리미엄</span>
    </div>
  )
}
