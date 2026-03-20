"use client"

import { useState, useCallback } from "react"
import { Container } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { SearchHeroSection } from "./SearchHeroSection"
import { LifestyleFilterChips } from "./LifestyleFilterChips"
import { SearchInfoBar } from "./SearchInfoBar"
import { SearchConditionBar } from "./SearchConditionBar"
import { PopularKeywords } from "./PopularKeywords"
import { ActiveFilters } from "./ActiveFilters"
import { FilterSidebar } from "./FilterSidebar"
import { FilterBottomSheet } from "./FilterBottomSheet"
import { useSearchFilters } from "../hooks"
import { searchResultsData, featuredSearchData, totalSearchResults } from "../data/mock"
import { getRegionImage } from "../data/regionImages"
import type { SearchAccommodation } from "../types"

// 기본 날짜 (오늘/내일)
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
    filters,
    sort,
    selectedRegion,
    toggleRegion,
    toggleLifestyle,
    toggleType,
    toggleAmenity,
    setPriceRange,
    setRating,
    setSort,
    resetFilters,
    removeFilter,
    activeFilterCount,
    hasActiveFilters,
  } = useSearchFilters()

  const regionData = getRegionImage(selectedRegion || undefined)
  const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultDates()

  // 날짜/인원 로컬 상태 (향후 URL 파라미터로 이관 가능)
  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)

  // 최근 검색어 로컬 상태
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

  const handleKeywordClick = useCallback(
    (keyword: string) => {
      // 최근 검색어에 추가
      setRecentSearches((prev) => {
        const filtered = prev.filter((k) => k !== keyword)
        return [keyword, ...filtered].slice(0, 10)
      })
      // TODO: 실제 키워드 검색 API 연동
    },
    []
  )

  const handleRemoveRecent = useCallback((keyword: string) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword))
  }, [])

  const handleClearRecent = useCallback(() => {
    setRecentSearches([])
  }, [])

  // 검색 조건이 있는지 여부 (히어로 표시 결정)
  const hasSearchCondition = hasActiveFilters || selectedRegion !== null

  // 모든 결과 합침 (기획전 + 일반)
  const allResults = hasSearchCondition
    ? [...featuredSearchData, ...searchResultsData]
    : searchResultsData

  return (
    <div className="min-h-screen">
      {/* Hero Section - 검색 조건 없을 때만 표시 */}
      {!hasSearchCondition && (
        <SearchHeroSection region={selectedRegion || undefined} />
      )}

      {/* Main Content */}
      <Container size="wide" padding="responsive">
        {/* 검색 조건 바 (날짜/인원/지역 퀵선택) */}
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

        {/* 라이프스타일 필터 칩 */}
        <div className="pb-4">
          <LifestyleFilterChips
            selectedFilters={filters.lifestyle}
            onToggle={toggleLifestyle}
          />
        </div>

        {/* 검색 조건 없을 때: 인기/최근 키워드 표시 */}
        {!hasSearchCondition && (
          <div className="py-6 border-t border-border">
            <PopularKeywords
              recentSearches={recentSearches}
              onKeywordClick={handleKeywordClick}
              onRemoveRecent={handleRemoveRecent}
              onClearRecent={handleClearRecent}
            />
          </div>
        )}

        {/* 검색 결과 영역 */}
        <SearchInfoBar
          totalCount={totalSearchResults}
          regionLabel={selectedRegion ? regionData.label : undefined}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Mobile Filter BottomSheet */}
        <FilterBottomSheet
          filters={filters}
          onToggleRegion={toggleRegion}
          onToggleType={toggleType}
          onToggleAmenity={toggleAmenity}
          onPriceChange={setPriceRange}
          onRatingChange={setRating}
          onReset={resetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6 lg:gap-8 pt-4">
          {/* Filter Sidebar - Desktop */}
          <FilterSidebar
            filters={filters}
            onToggleRegion={toggleRegion}
            onToggleType={toggleType}
            onToggleAmenity={toggleAmenity}
            onPriceChange={setPriceRange}
            onRatingChange={setRating}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemove={removeFilter}
              onReset={resetFilters}
            />

            {/* Search Results Grid */}
            <SearchResultGrid accommodations={allResults} />
          </div>
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
          다른 필터 조건이나 지역으로 검색해 보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 pb-12">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          priority={index < 6}
        />
      ))}

      {/* Load More Indicator (향후 무한스크롤 연동) */}
      <div className="col-span-full flex justify-center py-8">
        <p className="text-sm text-muted-foreground">
          더 많은 숙소를 보려면 스크롤하세요
        </p>
      </div>
    </div>
  )
}
