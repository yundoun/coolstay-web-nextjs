"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Container } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { SearchConditionBar } from "./SearchConditionBar"
import { SearchInfoBar } from "./SearchInfoBar"
import { KeywordSearchSection } from "./KeywordSearchSection"
import { useSearchFilters } from "../hooks"
import { useContentsList } from "../hooks/useContentsData"
import { useSearchModal } from "@/lib/stores/search-modal"
import { mapStoreToAccommodation } from "../utils/mapStoreToAccommodation"
import { searchResultsData, totalSearchResults } from "../data/mock"
import type { Accommodation } from "@/components/accommodation"
import type { StoreItem } from "@/lib/api/types"

function getDefaultDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return { checkIn: fmt(today), checkOut: fmt(tomorrow) }
}

export function SearchPageLayout() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  // store에서 regionCode 가져오기 (API 지역 코드)
  const regionCode = useSearchModal((s) => s.regionCode)

  // API 검색 파라미터
  const apiParams = useMemo(() => {
    if (!regionCode) return undefined
    return {
      search_type: "ST003" as const,
      search_extra: regionCode,
      search_start_date: checkIn,
      search_end_date: checkOut,
      search_adult_count: adults,
      search_kids_count: kids,
      count: 20,
    }
  }, [regionCode, checkIn, checkOut, adults, kids])

  const { data: apiData, isLoading } = useContentsList(apiParams)

  // API 데이터 → AccommodationCard 변환, 없으면 mock 폴백
  const accommodations: Accommodation[] = useMemo(() => {
    if (apiData?.motels?.length) {
      return apiData.motels.map((m: StoreItem) => mapStoreToAccommodation(m))
    }
    // API 결과 없으면 mock 데이터 폴백
    return searchResultsData
  }, [apiData])

  const totalCount = apiData?.totalCount ?? totalSearchResults

  const handleDateChange = useCallback((newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
  }, [])

  const handleGuestChange = useCallback((newAdults: number, newKids: number) => {
    setAdults(newAdults)
    setKids(newKids)
  }, [])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("checkIn", checkIn)
    params.set("checkOut", checkOut)
    params.set("adults", String(adults))
    if (kids > 0) params.set("kids", String(kids))
    else params.delete("kids")
    router.push(`/search?${params.toString()}`, { scroll: false })
  }, [searchParams, checkIn, checkOut, adults, kids, router])

  return (
    <div className="min-h-screen">
      <Container size="wide" padding="responsive">
        {/* 검색 조건 바 + 검색 버튼 */}
        <SearchConditionBar
          selectedRegion={selectedRegion}
          onRegionChange={toggleRegion}
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          kids={kids}
          onDateChange={handleDateChange}
          onGuestChange={handleGuestChange}
          onSearch={handleSearch}
        />

        {/* 해시태그 필터 */}
        <div className="py-4">
          <KeywordSearchSection />
        </div>

        {/* 결과 정보 + 정렬 */}
        <SearchInfoBar
          totalCount={totalCount}
          regionLabel={selectedRegion || undefined}
          sort={sort}
          onSortChange={setSort}
        />

        {/* 검색 결과 */}
        <div className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <SearchResultGrid accommodations={accommodations} />
          )}
        </div>
      </Container>
    </div>
  )
}

function SearchResultGrid({
  accommodations,
}: {
  accommodations: Accommodation[]
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
