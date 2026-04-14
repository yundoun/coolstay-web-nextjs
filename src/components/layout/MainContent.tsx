"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getRouteLayoutConfig } from "@/components/layout/route-layout-config"

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className }: MainContentProps) {
  const pathname = usePathname()
  const config = getRouteLayoutConfig(pathname ?? "/")

  const isCompactHeader = config.headerVariant === "back" || config.headerVariant === "minimal"

  return (
    <div
      className={cn(
        "flex-1",
        isCompactHeader
          ? "pt-14 md:pt-[var(--header-height)]"
          : "pt-16 md:pt-[var(--header-height)]",
        config.showBottomNav ? "pb-14 md:pb-0" : "pb-0",
        className
      )}
    >
      {children}
    </div>
  )
}
