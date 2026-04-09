import { useQuery } from "@tanstack/react-query"
import {
  getKeywordList,
  getKeywordSearchKeys,
  getKeywordSearchList,
  type KeywordSearchParams,
} from "../api/keywordApi"
import { getPopularKeywords } from "@/domains/cs/api/csApi"

// 꿀키워드 전체 목록 (자동완성용)
export function useKeywordList() {
  return useQuery({
    queryKey: ["contents", "keywordList"],
    queryFn: getKeywordList,
    retry: 1,
  })
}

// 인기 검색어 (CMS 관리)
export function usePopularKeywords() {
  return useQuery({
    queryKey: ["manage", "popularKeyword"],
    queryFn: getPopularKeywords,
    staleTime: 5 * 60 * 1000, // 5분 캐시
    retry: 1,
  })
}

// 꿀키워드 검색 (store keys)
export function useKeywordSearchKeys(params: KeywordSearchParams | undefined) {
  return useQuery({
    queryKey: ["contents", "keywordSearch", params],
    queryFn: () => getKeywordSearchKeys(params!),
    enabled: !!params,
    retry: 1,
  })
}

// 2단계 키워드 검색: keys 조회 → 숙소 목록 조회
export function useKeywordSearch(params: KeywordSearchParams | undefined) {
  // 1단계: filter keys 조회
  const keysQuery = useKeywordSearchKeys(params)

  const filters = keysQuery.data?.filters
  const hasFilters = !!filters && filters.length > 0

  // 2단계: keys로 숙소 목록 조회
  const listQuery = useQuery({
    queryKey: ["contents", "keywordSearchList", params, filters],
    queryFn: () =>
      getKeywordSearchList(
        {
          checkIn: params!.checkIn!,
          checkOut: params!.checkOut!,
          adultCnt: params!.adultCnt,
          kidCnt: params!.kidCnt,
          latitude: params!.latitude || undefined,
          longitude: params!.longitude || undefined,
        },
        filters!,
      ),
    enabled: hasFilters,
    retry: 1,
  })

  return {
    data: listQuery.data,
    totalCount: Math.max(keysQuery.data?.total_count ?? 0, 0),
    isLoading: keysQuery.isLoading || (hasFilters && listQuery.isLoading),
    isError: keysQuery.isError || listQuery.isError,
    // keys는 있지만 결과 0건인 경우도 처리
    isEmpty: keysQuery.isSuccess && (!filters || filters.length === 0),
  }
}
