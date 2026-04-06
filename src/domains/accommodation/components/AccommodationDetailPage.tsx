"use client"

import { useEffect } from "react"
import { Building2 } from "lucide-react"
import { useStoreDetail } from "../hooks/useDetailData"
import { mapMotelToDetail } from "../utils/mapMotelToDetail"
import { AccommodationDetailLayout } from "./AccommodationDetailLayout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { addRecentStoreKey } from "@/domains/home/api/homeApi"

interface Props {
  storeKey: string
}

export function AccommodationDetailPage({ storeKey }: Props) {
  const { data: apiData, isLoading } = useStoreDetail(storeKey)

  // 비회원용 최근 본 숙소 기록
  useEffect(() => {
    if (storeKey) addRecentStoreKey(storeKey)
  }, [storeKey])

  // API 데이터 → AccommodationDetail 변환
  const detail = apiData?.motel
    ? mapMotelToDetail(apiData.motel)
    : null

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

  return <AccommodationDetailLayout accommodation={detail} />
}
