"use client"

import { useStoreDetail } from "../hooks/useDetailData"
import { mapMotelToDetail } from "../utils/mapMotelToDetail"
import { AccommodationDetailLayout } from "./AccommodationDetailLayout"
import { getAccommodationDetail } from "../data/mock"

interface Props {
  storeKey: string
}

export function AccommodationDetailPage({ storeKey }: Props) {
  const { data: apiData, isLoading, error } = useStoreDetail(storeKey)

  // API 데이터 → AccommodationDetail 변환
  const accommodation = apiData?.motel
    ? mapMotelToDetail(apiData.motel)
    : null

  // API 실패 시 mock 폴백
  const mockData = getAccommodationDetail(storeKey)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const detail = accommodation || mockData

  if (!detail) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">숙소를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">요청하신 숙소 정보가 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  return <AccommodationDetailLayout accommodation={detail} />
}
