"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Container } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { SearchConditionBar } from "./SearchConditionBar"
import { SearchInfoBar } from "./SearchInfoBar"
import { BusinessTypeFilter } from "./BusinessTypeFilter"
import { useSearchFilters } from "../hooks"
import { useFilterSearch, useMyAreaList } from "../hooks/useContentsData"
import { useKeywordSearch } from "../hooks/useKeywordData"
import { useUserLocation } from "../hooks/useUserLocation"
import { mapStoreToAccommodation } from "../utils/mapStoreToAccommodation"
import type { Accommodation } from "@/components/accommodation"
import type { StoreItem } from "@/lib/api/types"
import { buildRegionChangeParams } from "../utils/searchParams"

const PROMO_LABEL: Record<string, string> = {
  ST1001: "무제한 쿠폰",
  ST1000: "국내 최저가",
  ST1002: "첫예약 선물",
}

/** YYYY-MM-DD → yyyyMMdd (API 요구 포맷) */
function toApiDate(date: string) {
  return date.replace(/-/g, "")
}

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
    setSort,
  } = useSearchFilters()

  const { location: userLocation, isLocating } = useUserLocation()
  const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultDates()

  // URL params를 source of truth로 사용
  // keyword와 regionCode는 배타적 — 동시에 존재하면 regionCode 우선
  const rawKeyword = searchParams?.get("keyword") ?? ""
  const regionCode = searchParams?.get("regionCode") ?? ""
  const regionName = searchParams?.get("regionName") ?? ""
  const keyword = regionCode ? "" : rawKeyword
  const businessType = searchParams?.get("type") ?? ""
  const checkIn = searchParams?.get("checkIn") || defaultCheckIn
  const checkOut = searchParams?.get("checkOut") || defaultCheckOut
  const adults = Number(searchParams?.get("adults")) || 2
  const kids = Number(searchParams?.get("kids")) || 0
  // 프로모 카드 전용: ST1000(최저가), ST1001(무제한쿠폰), ST1002(첫예약)
  const promoSearchType = searchParams?.get("searchType") ?? ""

  // ─── 키워드 검색 (2단계: search/keyword → keyword/list) ───
  const keywordParams = useMemo(() => {
    if (!keyword || regionCode || promoSearchType || isLocating) return undefined
    return {
      type: "ST701",
      extraType: keyword,
      checkIn: toApiDate(checkIn),
      checkOut: toApiDate(checkOut),
      adultCount: adults,
      kidsCount: kids,
      latitude: "",
      longitude: "",
      businessType: businessType || undefined,
      sort,
    }
  }, [keyword, regionCode, promoSearchType, isLocating, checkIn, checkOut, adults, kids, businessType, sort])

  const keywordSearch = useKeywordSearch(keywordParams)

  // ─── 지역 검색 (2단계: filter → filter/list) ───
  // AOS 앱: 지역 검색 시 latitude/longitude를 빈 문자열로 전송
  const filterParams = useMemo(() => {
    if (promoSearchType || !regionCode) return undefined
    return {
      type: "ST003",
      extraType: regionCode,
      checkIn: toApiDate(checkIn),
      checkOut: toApiDate(checkOut),
      adultCount: adults,
      kidsCount: kids,
      latitude: "",
      longitude: "",
      businessType: businessType || undefined,
      sort,
    }
  }, [promoSearchType, regionCode, checkIn, checkOut, adults, kids, businessType, sort])

  const filterSearch = useFilterSearch(filterParams)

  // ─── 프로모 카드 검색 (전용 search_type, 전국 대상) ───
  // extraType/latitude/longitude를 빼면 해당 프로모 타입의 전체 숙소 반환
  // ST1001(무제한쿠폰)은 packageType 필수
  const packageType = searchParams?.get("packageType") ?? undefined
  const promoParams = useMemo(() => {
    if (!promoSearchType) return undefined
    return {
      type: promoSearchType,
      checkIn: toApiDate(checkIn),
      checkOut: toApiDate(checkOut),
      adultCount: adults,
      kidsCount: kids,
      businessType: businessType || undefined,
      sort: sort || "BENEFIT",
      packageType,
    }
  }, [promoSearchType, checkIn, checkOut, adults, kids, businessType, sort, packageType])

  const promoSearch = useFilterSearch(promoParams)

  // ─── 키워드·지역·프로모 모두 없을 때 내 주변 추천 숙소 ───
  const myAreaParams = useMemo(() => {
    if (regionCode || keyword || promoSearchType || isLocating) return undefined
    return {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      businessType: businessType || undefined,
    }
  }, [regionCode, keyword, promoSearchType, isLocating, userLocation, businessType])
  const { data: myAreaData, isLoading: isMyAreaLoading } = useMyAreaList(myAreaParams)

  const isLoading = keywordSearch.isLoading || filterSearch.isLoading || promoSearch.isLoading || isMyAreaLoading

  // 우선순위: 프로모 검색 > 키워드 검색 > 지역 검색 > myArea
  const accommodations: Accommodation[] = useMemo(() => {
    if (promoSearch.data?.motels?.length) {
      return promoSearch.data.motels.map((m: StoreItem) => mapStoreToAccommodation(m))
    }
    if (keywordSearch.data?.motels?.length) {
      return keywordSearch.data.motels.map((m: StoreItem) => mapStoreToAccommodation(m))
    }
    if (filterSearch.data?.motels?.length) {
      return filterSearch.data.motels.map((m: StoreItem) => mapStoreToAccommodation(m))
    }
    if (myAreaData?.motels?.length) {
      return myAreaData.motels.map((m: StoreItem) => mapStoreToAccommodation(m))
    }
    return []
  }, [promoSearch.data, keywordSearch.data, filterSearch.data, myAreaData])

  // API total_count가 -1 또는 0이면 실제 배열 길이를 폴백으로 사용
  const totalCount = (() => {
    if (promoSearch.data?.motels?.length) {
      return promoSearch.totalCount || promoSearch.data.motels.length
    }
    if (keywordSearch.data?.motels?.length) {
      return keywordSearch.totalCount || keywordSearch.data.motels.length
    }
    if (filterSearch.data?.motels?.length) {
      return filterSearch.totalCount || filterSearch.data.motels.length
    }
    if (myAreaData?.motels?.length) {
      const apiCount = myAreaData.total_count ?? 0
      return apiCount > 0 ? apiCount : myAreaData.motels.length
    }
    return 0
  })()

  // URL params를 갱신하는 헬퍼
  const pushParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "")
      for (const [key, value] of Object.entries(overrides)) {
        if (value != null && value !== "") params.set(key, value)
        else params.delete(key)
      }
      router.push(`/search?${params.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  const handleDateChange = useCallback(
    (newCheckIn: string, newCheckOut: string) => {
      pushParams({ checkIn: newCheckIn, checkOut: newCheckOut })
    },
    [pushParams],
  )

  const handleGuestChange = useCallback(
    (newAdults: number, newKids: number) => {
      pushParams({
        adults: String(newAdults),
        kids: newKids > 0 ? String(newKids) : undefined,
      })
    },
    [pushParams],
  )

  const handleSearch = useCallback(() => {
    pushParams({
      checkIn,
      checkOut,
      adults: String(adults),
      kids: kids > 0 ? String(kids) : undefined,
    })
  }, [pushParams, checkIn, checkOut, adults, kids])

  const handleRegionChange = useCallback(
    (name: string, code: string) => {
      const current = new URLSearchParams(searchParams?.toString() ?? "")
      const next = buildRegionChangeParams(current, name, code)
      router.push(`/search?${next.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  return (
    <div className="min-h-screen">
      <Container size="wide" padding="responsive">
        {/* 검색 조건 바 + 검색 버튼 */}
        <SearchConditionBar
          selectedRegion={regionName || selectedRegion}
          isKeywordSearch={!!keyword}
          onRegionChange={handleRegionChange}
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          kids={kids}
          onDateChange={handleDateChange}
          onGuestChange={handleGuestChange}
          onSearch={handleSearch}
        />

        {/* 업태 필터 */}
        <div className="py-3">
          <BusinessTypeFilter />
        </div>

        {/* 결과 정보 + 정렬 */}
        <SearchInfoBar
          totalCount={totalCount}
          regionLabel={
            promoSearchType
              ? PROMO_LABEL[promoSearchType]
              : regionName || selectedRegion || undefined
          }
          keyword={keyword || undefined}
          sort={sort}
          onSortChange={setSort}
        />

        {/* 검색 결과 */}
        <div className="pt-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <SearchResultGrid accommodations={accommodations} />
          )}
        </div>
      </Container>
    </div>
  )
}

const PAGE_SIZE = 12

function SearchResultGrid({
  accommodations,
}: {
  accommodations: Accommodation[]
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset on new search results
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [accommodations])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, accommodations.length))
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [accommodations.length])

  if (accommodations.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="검색 결과가 없습니다"
        description="다른 조건이나 지역으로 검색해 보세요."
      />
    )
  }

  const visibleItems = accommodations.slice(0, visibleCount)
  const hasMore = visibleCount < accommodations.length

  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.map((accommodation, index) => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
            priority={index < 6}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <LoadingSpinner size="sm" className="py-4" />
        </div>
      )}

      {!hasMore && accommodations.length > PAGE_SIZE && (
        <div className="flex justify-center py-8">
          <p className="text-sm text-muted-foreground">
            총 {accommodations.length}개의 숙소를 모두 보여드렸습니다
          </p>
        </div>
      )}
    </div>
  )
}
