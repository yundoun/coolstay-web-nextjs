"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// 헤더 패딩이 필요 없는 페이지 (히어로 섹션이 있는 페이지)
const FULL_BLEED_PATHS = ["/", "/search2"]

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
