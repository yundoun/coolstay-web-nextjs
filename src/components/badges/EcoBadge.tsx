"use client"

import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface EcoBadgeProps {
  size?: "sm" | "md"
  className?: string
}

export function EcoBadge({ size = "md", className }: EcoBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-emerald-500/90 text-white backdrop-blur-sm",
        "shadow-sm",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <Leaf className={cn(size === "sm" ? "size-3" : "size-3.5")} />
      <span>에코</span>
    </div>
  )
}
