import type { HttpClient } from "@/lib/ports/HttpClient"
import type { HomeRepository } from "../ports/HomeRepository"
import type { HomeMainResponse, RegionStoresResponse } from "@/lib/api/types"

const DEFAULT_REGION_CODE = "ALL_0100000"

export class ApiHomeRepository implements HomeRepository {
  constructor(private http: HttpClient) {}

  getMain(regionCode: string = DEFAULT_REGION_CODE, recentStoreKeys?: string) {
    return this.http.post<HomeMainResponse>("/home/main", {
      region_code: regionCode,
      popup_notice_yn: "N",
      coupon_only_yn: "N",
      ...(recentStoreKeys ? { recent_store_keys: recentStoreKeys } : {}),
    })
  }

  getRegionStores(regionCode: string) {
    return this.http.post<RegionStoresResponse>("/home/regionStores", {
      region_code: regionCode,
    })
  }
}
