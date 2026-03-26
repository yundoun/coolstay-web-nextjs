import { api } from "@/lib/api/client"
import type {
  KeywordListResponse,
  FilterResponse,
  ContentsListResponse,
  FilterKey,
} from "@/lib/api/types"

// ─── 꿀키워드 전체 목록 ───
export function getKeywordList() {
  return api.get<KeywordListResponse>("/contents/total/keywordList", {
    isCompress: 0,
  })
}

// ─── 꿀키워드로 제휴점 key 조회 ───
export interface KeywordSearchParams {
  type: string
  extraType?: string
  checkIn?: string
  checkOut?: string
  adultCnt?: number
  kidCnt?: number
  latitude?: string
  longitude?: string
  sort?: string
  businessType?: string
}

export function getKeywordSearchKeys(params: KeywordSearchParams) {
  return api.get<FilterResponse>("/contents/search/keyword", {
    ...params,
    isCompress: 0,
  } as Record<string, string | number | boolean | undefined>)
}

// ─── 꿀키워드 검색 결과 (페이징) ───
export interface KeywordListSearchParams {
  checkIn: string
  checkOut: string
  adultCount?: number
  kidsCount?: number
  latitude?: string
  longitude?: string
  type?: string
}

export function getKeywordSearchList(
  params: KeywordListSearchParams,
  filters: FilterKey[],
) {
  return api.post<ContentsListResponse>(
    "/contents/search/keyword/list",
    { filters },
    { ...params, isCompress: 0 } as Record<string, string | number | boolean | undefined>,
  )
}
