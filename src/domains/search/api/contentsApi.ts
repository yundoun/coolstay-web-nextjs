import { api } from "@/lib/api/client"
import type {
  RegionsResponse,
  ContentsListResponse,
  TotalListResponse,
  FilterResponse,
  FilterKey,
  MyAreaResponse,
} from "@/lib/api/types"

type Params = Record<string, string | number | boolean | undefined>

// ─── 지역 목록 ───
export function getRegions(categoryCode: string = "ALL,SUBWAY") {
  return api.get<RegionsResponse>("/contents/regions/list", {
    category_code: categoryCode,
  })
}

// ─── 숙소 목록 (contents/list) ───
export interface ContentsListParams {
  search_type: string    // ST001~ST008 (ServerCode.SearchType)
  search_extra?: string  // 지역코드, 숙소명, 키워드 등
  search_start_date?: string
  search_end_date?: string
  search_adult_count?: number
  search_kids_count?: number
  latitude?: string
  longitude?: string
  sort?: string
  count?: number
  cursor?: string
}

export function getContentsList(params: ContentsListParams) {
  return api.get<ContentsListResponse>("/contents/list", { ...params } as Params)
}

// ─── 제휴점 전체 목록 (total/list) ───
export function getTotalList() {
  return api.get<TotalListResponse>("/contents/total/list", {
    isCompress: 0,
  })
}

// ─── 필터 기반 검색 (2단계: filter → filter/list) ───
export interface FilterParams {
  type: string
  extraType?: string
  checkIn?: string
  checkOut?: string
  adultCnt?: number
  kidCnt?: number
  latitude?: string
  longitude?: string
  businessType?: string
  storeType?: string
  sort?: string
  packageType?: string
}

export function getFilterKeys(params: FilterParams) {
  return api.get<FilterResponse>("/contents/filter", {
    ...params,
    isCompress: 0,
  } as Params)
}

export interface FilterListParams {
  checkIn: string
  checkOut: string
  adultCount?: number
  kidsCount?: number
  type?: string
  latitude?: string
  longitude?: string
}

export function getFilterList(params: FilterListParams, filters: FilterKey[]) {
  return api.post<ContentsListResponse>(
    "/contents/filter/list",
    { filters },
    { ...params, isCompress: 0 } as Params,
  )
}

// ─── 내 주변 추천 숙소 ───
export interface MyAreaParams {
  latitude: string
  longitude: string
  businessType?: string
  filterBit?: number
}

export function getMyAreaList(params: MyAreaParams) {
  return api.get<MyAreaResponse>("/contents/myArea/list", {
    ...params,
    isCompress: 0,
  } as Params)
}
