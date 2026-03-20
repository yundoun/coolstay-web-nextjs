"use client"

import { useState } from "react"
import { TrendingUp, Clock, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 모바일 앱 기반 인기 키워드 (실제로는 API에서 가져옴)
const popularKeywords = [
  "해운대",
  "제주 오션뷰",
  "강남 호텔",
  "속초 펜션",
  "경주 한옥",
  "여수 바다",
  "전주 한옥마을",
  "부산 광안리",
  "강릉 커피",
  "서울 호캉스",
]

interface PopularKeywordsProps {
  recentSearches: string[]
  onKeywordClick: (keyword: string) => void
  onRemoveRecent: (keyword: string) => void
  onClearRecent: () => void
}

export function PopularKeywords({
  recentSearches,
  onKeywordClick,
  onRemoveRecent,
  onClearRecent,
}: PopularKeywordsProps) {
  return (
    <div className="space-y-8">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">최근 검색어</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={onClearRecent}
            >
              전체 삭제
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((keyword) => (
              <div
                key={keyword}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  "bg-muted/50 border border-border/50",
                  "text-sm group"
                )}
              >
                <button
                  onClick={() => onKeywordClick(keyword)}
                  className="hover:text-primary transition-colors"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => onRemoveRecent(keyword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Keywords */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">인기 검색어</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-2">
          {popularKeywords.map((keyword, index) => (
            <button
              key={keyword}
              onClick={() => onKeywordClick(keyword)}
              className={cn(
                "flex items-center gap-2.5 py-2 text-sm",
                "text-left hover:text-primary transition-colors",
                "group"
              )}
            >
              <span
                className={cn(
                  "w-5 text-center text-xs font-bold",
                  index < 3 ? "text-primary" : "text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span className="truncate group-hover:underline underline-offset-2">
                {keyword}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
