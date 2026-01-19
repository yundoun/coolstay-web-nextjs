"use client"

import { cn } from "@/lib/utils"
import { BentoAccommodationCard } from "./BentoAccommodationCard"
import type { Search2Accommodation, BentoSize } from "../types"

interface BentoSearchResultGridProps {
  accommodations: Search2Accommodation[]
}

// 벤토 레이아웃 패턴 (8개 아이템 반복)
const bentoPattern: BentoSize[] = [
  "large",  // 2x2 - Featured
  "small",  // 1x1
  "small",  // 1x1
  "wide",   // 2x1
  "tall",   // 1x2
  "small",  // 1x1
  "small",  // 1x1
  "wide",   // 2x1
]

export function BentoSearchResultGrid({
  accommodations,
}: BentoSearchResultGridProps) {
  if (accommodations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="size-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-foreground">
          검색 결과가 없습니다
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          다른 필터 조건이나 지역으로 검색해 보세요.
          <br />
          원하는 숙소를 찾을 수 있을 거예요!
        </p>
      </div>
    )
  }

  // 벤토 사이즈 할당
  const accommodationsWithSize = accommodations.map((acc, index) => ({
    ...acc,
    bentoSize: acc.bentoSize || bentoPattern[index % bentoPattern.length],
  }))

  return (
    <div
      className={cn(
        "grid gap-3 md:gap-4",
        // 모바일: 2열, 균일한 높이
        "grid-cols-2 auto-rows-[200px]",
        // 데스크톱: 4열, 벤토 그리드
        "md:grid-cols-4 md:auto-rows-[180px]"
      )}
    >
      {accommodationsWithSize.map((accommodation, index) => (
        <BentoAccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          priority={index < 4}
        />
      ))}
    </div>
  )
}
