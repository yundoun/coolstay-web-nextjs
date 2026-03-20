import { useQuery } from "@tanstack/react-query"
import { getHomeFilter, getMyAreaMotels, getRegions } from "../api/homeApi"

// 홈 메인 데이터 (배너, 태그, 숙소 key 목록)
export function useHomeFilter() {
  return useQuery({
    queryKey: ["home", "filter"],
    queryFn: () => getHomeFilter(),
    retry: 1,
  })
}

// 내 주변 추천 숙소
export function useMyAreaMotels(params?: {
  businessType?: string
  latitude?: string
  longitude?: string
}) {
  return useQuery({
    queryKey: ["home", "myArea", params],
    queryFn: () => getMyAreaMotels(params),
    retry: 1,
  })
}

// 지역 목록
export function useRegions(categoryCode?: string) {
  return useQuery({
    queryKey: ["home", "regions", categoryCode],
    queryFn: () => getRegions(categoryCode),
    retry: 1,
  })
}
