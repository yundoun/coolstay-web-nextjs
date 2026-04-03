"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { HASHTAG_KEYWORDS } from "../data/autocomplete"

export function KeywordSearchSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeKeywords, setActiveKeywords] = useState<Set<string>>(new Set())

  const handleHashtagClick = (keyword: string) => {
    const next = new Set(activeKeywords)
    if (next.has(keyword)) {
      next.delete(keyword)
    } else {
      next.add(keyword)
    }
    setActiveKeywords(next)

    // 선택된 키워드로 검색 반영 (지역 검색과 충돌 방지: regionCode 제거)
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.delete("regionCode")
    if (next.size > 0) {
      params.set("keyword", Array.from(next).join(","))
    } else {
      params.delete("keyword")
    }
    router.push(`/search?${params.toString()}`)
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
