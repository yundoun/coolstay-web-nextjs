import { useQuery } from "@tanstack/react-query"
import { getHomeMain, getRegionStores } from "../api/homeApi"

// 홈 메인 데이터 (배너, 카테고리, 추천 숙소, 기획전 등 전체)
export function useHomeMain(regionCode?: string) {
  return useQuery({
    queryKey: ["home", "main", regionCode],
    queryFn: () => getHomeMain(regionCode),
    retry: 1,
  })
}

// 지역 탭 전환 시 해당 지역 추천 숙소만 조회
export function useRegionStores(regionCode: string | undefined) {
  return useQuery({
    queryKey: ["home", "regionStores", regionCode],
    queryFn: () => getRegionStores(regionCode!),
    enabled: !!regionCode,
    retry: 1,
  })
}
