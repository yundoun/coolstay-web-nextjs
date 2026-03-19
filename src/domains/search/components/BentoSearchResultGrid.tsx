"use client"

import { cn } from "@/lib/utils"
import { BentoAccommodationCard } from "./BentoAccommodationCard"
import type { SearchAccommodation, BentoSize } from "../types"

interface BentoSearchResultGridProps {
  accommodations: SearchAccommodation[]
}

const bentoPattern: BentoSize[] = [
  "large",
  "small",
  "small",
  "wide",
  "tall",
  "small",
  "small",
  "wide",
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
        </p>
      </div>
    )
  }

  const accommodationsWithSize = accommodations.map((acc, index) => ({
    ...acc,
    bentoSize: acc.bentoSize || bentoPattern[index % bentoPattern.length],
  }))

  return (
    <div
      className={cn(
        "grid gap-3 md:gap-4",
        "grid-cols-2 auto-rows-[200px]",
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
