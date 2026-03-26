import { useQuery } from "@tanstack/react-query"
import {
  getRegions,
  getContentsList,
  getTotalList,
  getFilterKeys,
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

// 숙소 목록 (contents/list)
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

// 내 주변 추천 숙소
export function useMyAreaList(params: MyAreaParams | undefined) {
  return useQuery({
    queryKey: ["contents", "myArea", params],
    queryFn: () => getMyAreaList(params!),
    enabled: !!params?.latitude && !!params?.longitude,
    retry: 1,
  })
}
