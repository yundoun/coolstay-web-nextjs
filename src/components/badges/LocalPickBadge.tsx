"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocalPickBadgeProps {
  size?: "sm" | "md"
  className?: string
}

export function LocalPickBadge({ size = "md", className }: LocalPickBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-violet-500/90 text-white backdrop-blur-sm",
        "shadow-sm",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <MapPin className={cn(size === "sm" ? "size-3" : "size-3.5")} />
      <span>로컬픽</span>
    </div>
  )
}
