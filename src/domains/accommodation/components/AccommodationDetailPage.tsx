"use client"

import { useEffect, useState, useCallback } from "react"
import { Building2 } from "lucide-react"
import { useStoreDetail } from "../hooks/useDetailData"
import { mapMotelToDetail } from "../utils/mapMotelToDetail"
import { AccommodationDetailLayout } from "./AccommodationDetailLayout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { addRecentStoreKey } from "@/domains/home/api/homeApi"
import { useHeaderStore } from "@/lib/stores/header"

function toApiDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
}

interface Props {
  storeKey: string
}

export function AccommodationDetailPage({ storeKey }: Props) {
  const [dates, setDates] = useState<{ start: string; end: string } | undefined>(undefined)
  const { data: apiData, isLoading, isFetching } = useStoreDetail(storeKey, dates)

  const setDynamicTitle = useHeaderStore((s) => s.setDynamicTitle)

  // API 데이터 → AccommodationDetail 변환
  const detail = apiData?.motel
    ? mapMotelToDetail(apiData.motel)
    : null

  // 비회원용 최근 본 숙소 기록
  useEffect(() => {
    if (storeKey) addRecentStoreKey(storeKey)
  }, [storeKey])

  // 헤더에 숙소명 표시
  useEffect(() => {
    if (detail) setDynamicTitle(detail.name)
    return () => setDynamicTitle(null)
  }, [detail, setDynamicTitle])

  // 날짜 변경 시 API 재조회
  const handleApply = useCallback((checkIn: Date, checkOut: Date) => {
    setDates({
      start: toApiDate(checkIn),
      end: toApiDate(checkOut),
    })
  }, [])

  if (isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (!detail) {
    return (
      <EmptyState
        icon={Building2}
        title="숙소를 찾을 수 없습니다"
        description="요청하신 숙소 정보가 존재하지 않습니다."
        action={{ label: "숙소 둘러보기", href: "/search" }}
        className="min-h-[50vh]"
      />
    )
  }

  return (
    <AccommodationDetailLayout
      accommodation={detail}
      onApply={handleApply}
      isRefetching={isFetching && !isLoading}
    />
  )
}
