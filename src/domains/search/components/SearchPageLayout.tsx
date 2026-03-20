"use client"

import { useState, useCallback } from "react"
import { Container } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { SearchConditionBar } from "./SearchConditionBar"
import { PopularKeywords } from "./PopularKeywords"
import { SearchInfoBar } from "./SearchInfoBar"
import { useSearchFilters } from "../hooks"
import { searchResultsData, totalSearchResults } from "../data/mock"
import { regionLabels } from "../data/filterOptions"
import type { SearchAccommodation } from "../types"

function getDefaultDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return { checkIn: fmt(today), checkOut: fmt(tomorrow) }
}

export function SearchPageLayout() {
  const {
    sort,
    selectedRegion,
    toggleRegion,
    setSort,
  } = useSearchFilters()

  const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultDates()

  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)

  const [recentSearches, setRecentSearches] = useState<string[]>([
    "해운대 호텔",
    "제주 펜션",
    "강릉 오션뷰",
  ])

  const handleDateChange = useCallback((newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
  }, [])

  const handleGuestChange = useCallback((newAdults: number, newKids: number) => {
    setAdults(newAdults)
    setKids(newKids)
  }, [])

  const handleKeywordClick = useCallback((keyword: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((k) => k !== keyword)
      return [keyword, ...filtered].slice(0, 10)
    })
  }, [])

  const handleRemoveRecent = useCallback((keyword: string) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword))
  }, [])

  const handleClearRecent = useCallback(() => {
    setRecentSearches([])
  }, [])

  return (
    <div className="min-h-screen">
      <Container size="wide" padding="responsive">
        {/* 검색 조건 바 — 항상 표시 */}
        <SearchConditionBar
          selectedRegion={selectedRegion}
          onRegionChange={toggleRegion}
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          kids={kids}
          onDateChange={handleDateChange}
          onGuestChange={handleGuestChange}
        />

        {/* 인기/최근 키워드 — 항상 표시 (접을 수 있는 컴팩트 형태) */}
        <PopularKeywords
          recentSearches={recentSearches}
          onKeywordClick={handleKeywordClick}
          onRemoveRecent={handleRemoveRecent}
          onClearRecent={handleClearRecent}
        />

        {/* 결과 정보 + 정렬 */}
        <SearchInfoBar
          totalCount={totalSearchResults}
          regionLabel={selectedRegion ? regionLabels[selectedRegion] : undefined}
          sort={sort}
          onSortChange={setSort}
        />

        {/* 검색 결과 */}
        <div className="pt-4">
          <SearchResultGrid accommodations={searchResultsData} />
        </div>
      </Container>
    </div>
  )
}

function SearchResultGrid({
  accommodations,
}: {
  accommodations: SearchAccommodation[]
}) {
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
          다른 조건이나 지역으로 검색해 보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          priority={index < 6}
        />
      ))}

      <div className="col-span-full flex justify-center py-8">
        <p className="text-sm text-muted-foreground">
          더 많은 숙소를 보려면 스크롤하세요
        </p>
      </div>
    </div>
  )
}
