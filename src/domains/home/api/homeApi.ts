import { api } from "@/lib/api/client"
import type { HomeMainResponse, RegionStoresResponse } from "@/lib/api/types"

const DEFAULT_REGION_CODE = "ALL_0100000" // 강남/역삼/삼성/논현

// 홈 화면 전체 데이터
export function getHomeMain(regionCode: string = DEFAULT_REGION_CODE) {
  return api.post<HomeMainResponse>("/home/main", {
    region_code: regionCode,
    popup_notice_yn: "N",
    coupon_only_yn: "N",
  })
}

// 지역 탭 전환 시 추천 숙소만 갱신
export function getRegionStores(regionCode: string) {
  return api.post<RegionStoresResponse>("/home/regionStores", {
    region_code: regionCode,
  })
}
