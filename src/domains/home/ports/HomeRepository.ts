import type { HomeMainResponse, RegionStoresResponse } from "@/lib/api/types"

/**
 * 홈 도메인 Repository 포트
 */
export interface HomeRepository {
  getMain(regionCode?: string, recentStoreKeys?: string): Promise<HomeMainResponse>
  getRegionStores(regionCode: string): Promise<RegionStoresResponse>
}
