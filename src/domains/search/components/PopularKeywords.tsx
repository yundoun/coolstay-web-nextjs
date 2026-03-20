"use client"

import { useState } from "react"
import { TrendingUp, Clock, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-t border-border">
      {/* Toggle bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <span className="font-medium">인기 검색어</span>
          {!isExpanded && (
            <span className="text-xs text-muted-foreground/60 hidden sm:inline">
              {popularKeywords.slice(0, 3).join(" · ")}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="pb-4 space-y-5">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">최근 검색어</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm"
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-1.5">
            {popularKeywords.map((keyword, index) => (
              <button
                key={keyword}
                onClick={() => onKeywordClick(keyword)}
                className="flex items-center gap-2.5 py-1.5 text-sm text-left hover:text-primary transition-colors group"
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
      )}
    </div>
  )
}
