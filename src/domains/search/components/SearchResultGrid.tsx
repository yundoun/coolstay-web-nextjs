"use client"

import { AccommodationCard, type Accommodation } from "@/components/accommodation"

interface SearchResultGridProps {
  accommodations: Accommodation[]
}

export function SearchResultGrid({ accommodations }: SearchResultGridProps) {
  if (accommodations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">
          검색 결과가 없습니다
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          다른 검색 조건으로 다시 시도해 보세요
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          priority={index < 4}
        />
      ))}
    </div>
  )
}
