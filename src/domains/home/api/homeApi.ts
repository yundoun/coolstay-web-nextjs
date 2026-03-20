import { api } from "@/lib/api/client"
import type { FilterResponse, MyAreaResponse } from "@/lib/api/types"

interface FilterParams {
  type?: string
  extraType?: string
  checkIn?: string
  checkOut?: string
  adultCnt?: string
  kidCnt?: string
  sort?: string
  businessType?: string
  filterBit?: string
  longitude?: string
  latitude?: string
}

// 홈 메인 데이터 (배너 + 태그 + 숙소 key 목록)
export function getHomeFilter(params?: FilterParams) {
  return api.get<FilterResponse>("/contents/filter", {
    type: "ST003",
    extraType: "ALL_0100001",
    sort: "RANDOM",
    filterBit: "-100",
    isCompress: "0",
    ...params,
  })
}

// 숙소 key로 상세 목록 페이징 조회
export function getFilteredMotels(keys: { v2Key: string; v2RentKey: string; v2StayKey: string }[]) {
  return api.post<{ motels: unknown[] }>("/contents/filter/list", keys)
}

// 내 주변 추천 숙소
export function getMyAreaMotels(params?: {
  businessType?: string
  filterBit?: string
  longitude?: string
  latitude?: string
}) {
  return api.get<MyAreaResponse>("/contents/myArea/list", {
    filterBit: "-1",
    isCompress: "0",
    ...params,
  })
}

// 지역 정보 조회
export function getRegions(categoryCode: string = "ALL,SUBWAY") {
  return api.get<unknown>("/contents/regions/list", {
    category_code: categoryCode,
    isCompress: "0",
  })
}
