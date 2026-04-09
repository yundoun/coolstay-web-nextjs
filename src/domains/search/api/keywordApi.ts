import { api } from "@/lib/api/client"
import { decompressResult } from "@/lib/api/decompress"
import type {
  KeywordListResponse,
  CompressedResult,
  FilterResponse,
  ContentsListResponse,
  FilterKey,
} from "@/lib/api/types"

// ─── 꿀키워드 전체 목록 (압축 응답 → 해제) ───
export async function getKeywordList(): Promise<KeywordListResponse> {
  const compressed = await api.get<CompressedResult>("/contents/total/keywordList", {
    isCompress: true,
  })
  return decompressResult<KeywordListResponse>(compressed)
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
  businessType?: string
  sort?: string
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
  adultCnt?: number
  kidCnt?: number
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
