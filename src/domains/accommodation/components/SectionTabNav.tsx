"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

export interface SectionTab {
  id: string
  label: string
}

interface SectionTabNavProps {
  tabs: SectionTab[]
  stickyTop?: number
  className?: string
  /** "sticky" (기본) = 독립 sticky 바, "inline" = 부모가 sticky 처리 (PC용) */
  variant?: "sticky" | "inline"
}

/**
 * 섹션 앵커 탭 네비게이션
 * - 스크롤 시 상단 고정 (sticky)
 * - Intersection Observer로 현재 보이는 섹션 감지 → 활성 탭 표시
 * - 탭 클릭 시 해당 섹션으로 스크롤 이동
 */
export function SectionTabNav({ tabs, stickyTop = 56, className, variant = "sticky" }: SectionTabNavProps) {
  const isInline = variant === "inline"
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "")
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const navRef = useRef<HTMLDivElement>(null)
  const isClickScrolling = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: `-${stickyTop + 80}px 0px -60% 0px`,
        threshold: 0,
      },
    )

    for (const tab of tabs) {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [tabs, stickyTop])

  // 활성 탭 변경 시 탭 바 내 스크롤
  useEffect(() => {
    const btn = tabRefs.current.get(activeId)
    if (btn && navRef.current) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeId])

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return

      setActiveId(id)
      isClickScrolling.current = true

      const y = el.getBoundingClientRect().top + window.scrollY - stickyTop - 60
      window.scrollTo({ top: y, behavior: "smooth" })

      setTimeout(() => {
        isClickScrolling.current = false
      }, 800)
    },
    [stickyTop],
  )

  return (
    <div
      ref={navRef}
      className={cn(
        "overflow-x-auto scrollbar-hide",
        !isInline && "sticky bg-background border-b z-[var(--z-sticky,30)]",
        className,
      )}
      style={!isInline ? { top: stickyTop } : undefined}
    >
      <div className={cn("flex", isInline && "gap-1.5")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el)
            }}
            onClick={() => handleClick(tab.id)}
            className={cn(
              "shrink-0 font-medium whitespace-nowrap transition-all",
              isInline
                ? cn(
                    "text-[13px] px-3 py-1.5 rounded-full border",
                    activeId === tab.id
                      ? "bg-foreground text-background border-foreground"
                      : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
                  )
                : cn(
                    "text-sm px-4 py-3 border-b-2",
                    activeId === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ),
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
