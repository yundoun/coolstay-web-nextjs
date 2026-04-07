"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { HASHTAG_KEYWORDS } from "../data/autocomplete"
import { buildHashtagToggleParams } from "../utils/searchParams"

export function KeywordSearchSection() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL params를 source of truth로 사용 — 외부에서 keyword가 변경되면 자동 동기화
  // keyword와 regionCode는 배타적 — regionCode가 있으면 keyword 무시
  const activeKeywords = useMemo(() => {
    const regionCode = searchParams?.get("regionCode") ?? ""
    if (regionCode) return new Set<string>()
    const kw = searchParams?.get("keyword") ?? ""
    if (!kw) return new Set<string>()
    return new Set(kw.split(",").map((k) => k.trim()).filter(Boolean))
  }, [searchParams])

  const handleHashtagClick = (keyword: string) => {
    const current = new URLSearchParams(searchParams?.toString() ?? "")
    const next = buildHashtagToggleParams(current, keyword)
    router.push(`/search?${next.toString()}`, { scroll: false })
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Hash className="size-4 text-primary" />
        <span className="text-sm font-medium">인기 키워드</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {HASHTAG_KEYWORDS.map((keyword) => {
          const isActive = activeKeywords.has(keyword)
          return (
            <button
              key={keyword}
              onClick={() => handleHashtagClick(keyword)}
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <span className="text-xs mr-0.5">#</span>
              {keyword}
            </button>
          )
        })}
      </div>
    </div>
  )
}
