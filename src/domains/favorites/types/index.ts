import type { StoreItem } from "@/lib/api/types"

/**
 * 찜 목록의 숙소 아이템.
 * GET /contents/list?search_type=ST006 → ContentsListResponse.motels 의 각 항목은 StoreItem 형태.
 * FavoriteAccommodation = StoreItem 그대로 사용.
 */
export type FavoriteAccommodation = StoreItem

/** 최근 본 숙소 localStorage 저장 형태 */
export interface RecentViewedItem {
  key: string
  name: string
  imageUrl: string
  viewedAt: number // timestamp
}
