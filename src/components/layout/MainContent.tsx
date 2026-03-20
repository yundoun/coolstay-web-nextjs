"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const FULL_BLEED_PATHS: string[] = []

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className }: MainContentProps) {
  const pathname = usePathname()
  const isFullBleed = FULL_BLEED_PATHS.includes(pathname ?? "")

  return (
    <div
      className={cn(
        "flex-1",
        !isFullBleed && "pt-16 md:pt-[var(--header-height)]",
        className
      )}
    >
      {children}
    </div>
  )
}
