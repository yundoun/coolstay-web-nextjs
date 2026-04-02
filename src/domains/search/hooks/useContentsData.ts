import { useQuery } from "@tanstack/react-query"
import {
  getRegions,
  getContentsList,
  getTotalList,
  getFilterKeys,
  getFilterList,
  getMyAreaList,
  type ContentsListParams,
  type FilterParams,
  type MyAreaParams,
} from "../api/contentsApi"

// 지역 목록
export function useRegions(categoryCode?: string) {
  return useQuery({
    queryKey: ["contents", "regions", categoryCode],
    queryFn: () => getRegions(categoryCode),
    retry: 1,
  })
}

// 숙소 목록 (contents/list) — 단일 호출
export function useContentsList(params: ContentsListParams | undefined) {
  return useQuery({
    queryKey: ["contents", "list", params],
    queryFn: () => getContentsList(params!),
    enabled: !!params,
    retry: 1,
  })
}

// 제휴점 전체 목록
export function useTotalList() {
  return useQuery({
    queryKey: ["contents", "totalList"],
    queryFn: getTotalList,
    retry: 1,
  })
}

// 필터 기반 검색 (store keys)
export function useFilterKeys(params: FilterParams | undefined) {
  return useQuery({
    queryKey: ["contents", "filter", params],
    queryFn: () => getFilterKeys(params!),
    enabled: !!params,
    retry: 1,
  })
}

// 2단계 지역 검색: filter keys 조회 → filter/list 숙소 목록 조회
export function useFilterSearch(params: FilterParams | undefined) {
  // 1단계: filter keys 조회
  const keysQuery = useFilterKeys(params)

  const filters = keysQuery.data?.filters
  const hasFilters = !!filters && filters.length > 0

  // 2단계: keys로 숙소 목록 조회
  const listQuery = useQuery({
    queryKey: ["contents", "filterList", params, filters],
    queryFn: () =>
      getFilterList(
        {
          checkIn: params!.checkIn!,
          checkOut: params!.checkOut!,
          adultCount: params!.adultCnt,
          kidsCount: params!.kidCnt,
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
    isEmpty: keysQuery.isSuccess && (!filters || filters.length === 0),
  }
}

// 내 주변 추천 숙소
export function useMyAreaList(params: MyAreaParams | undefined) {
  return useQuery({
    queryKey: ["contents", "myArea", params],
    queryFn: () => getMyAreaList(params!),
    enabled: !!params?.latitude && !!params?.longitude,
    retry: 1,
  })
}
