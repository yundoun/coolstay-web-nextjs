"use client"

import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { sortOptions } from "../data/constants"

interface SearchInfoBarProps {
  totalCount: number
  regionLabel?: string
  keyword?: string
  sort: string
  onSortChange: (sort: string) => void
}

export function SearchInfoBar({
  totalCount,
  regionLabel,
  keyword,
  sort,
  onSortChange,
}: SearchInfoBarProps) {
  return (
    <div className="py-3">
      {/* 앱 스타일 가로 스크롤 정렬 pill 태그 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {sortOptions.map((option) => {
          const isActive = sort === option.value
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-border"
              )}
            >
              #{option.label}
            </button>
          )
        })}
        <button className="shrink-0 p-1.5 rounded-full border border-border">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* 결과 수 */}
      <p className="mt-2 text-xs text-muted-foreground">
        {keyword && <span className="font-medium text-foreground">&apos;{keyword}&apos; </span>}
        {!keyword && regionLabel && <span className="font-medium text-foreground">{regionLabel} </span>}
        {!keyword && !regionLabel && <span className="font-medium text-foreground">내 주변 </span>}
        검색 결과 {totalCount.toLocaleString()}개
      </p>
    </div>
  )
}
