"use client"

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewBadgeProps {
  size?: "sm" | "md"
  className?: string
}

export function NewBadge({ size = "md", className }: NewBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-rose-500/90 text-white backdrop-blur-sm",
        "shadow-sm",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <Sparkles className={cn(size === "sm" ? "size-3" : "size-3.5")} />
      <span>신규</span>
    </div>
  )
}
