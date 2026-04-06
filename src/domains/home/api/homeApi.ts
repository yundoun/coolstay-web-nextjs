import { api } from "@/lib/api/client"
import type { HomeMainResponse, RegionStoresResponse } from "@/lib/api/types"

const DEFAULT_REGION_CODE = "ALL_0100000" // 강남/역삼/삼성/논현

const RECENT_STORES_KEY = "coolstay_recent_stores"

/** 비회원용 최근 본 숙소 키 (localStorage) */
export function getRecentStoreKeys(): string {
  if (typeof window === "undefined") return ""
  try {
    const keys = JSON.parse(localStorage.getItem(RECENT_STORES_KEY) || "[]")
    return Array.isArray(keys) ? keys.slice(0, 50).join(",") : ""
  } catch {
    return ""
  }
}

/** 최근 본 숙소 키 추가 */
export function addRecentStoreKey(storeKey: string) {
  if (typeof window === "undefined") return
  try {
    const keys: string[] = JSON.parse(localStorage.getItem(RECENT_STORES_KEY) || "[]")
    const updated = [storeKey, ...keys.filter((k) => k !== storeKey)].slice(0, 50)
    localStorage.setItem(RECENT_STORES_KEY, JSON.stringify(updated))
  } catch { /* ignore */ }
}

// 홈 화면 전체 데이터
export function getHomeMain(regionCode: string = DEFAULT_REGION_CODE) {
  const recentKeys = getRecentStoreKeys()
  return api.post<HomeMainResponse>("/home/main", {
    region_code: regionCode,
    popup_notice_yn: "N",
    coupon_only_yn: "N",
    ...(recentKeys ? { recent_store_keys: recentKeys } : {}),
  })
}

// 지역 탭 전환 시 추천 숙소만 갱신
export function getRegionStores(regionCode: string) {
  return api.post<RegionStoresResponse>("/home/regionStores", {
    region_code: regionCode,
  })
}
