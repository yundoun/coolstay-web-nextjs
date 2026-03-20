"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

// 항상 full bleed인 페이지
const ALWAYS_FULL_BLEED_PATHS = ["/"]

// 조건부 full bleed (검색 파라미터 없을 때만)
const CONDITIONAL_FULL_BLEED_PATHS = ["/search"]

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className }: MainContentProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isAlwaysFullBleed = ALWAYS_FULL_BLEED_PATHS.includes(pathname ?? "")
  const isConditionalFullBleed =
    CONDITIONAL_FULL_BLEED_PATHS.includes(pathname ?? "") &&
    (!searchParams || searchParams.toString() === "")

  const isFullBleed = isAlwaysFullBleed || isConditionalFullBleed

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
