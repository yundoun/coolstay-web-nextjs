import type {
  DetailsResponse,
  ImagesResponse,
  DailyBookStatusResponse,
  RefundPolicyResponse,
} from "@/lib/api/types"

export interface StoreDetailParams {
  motel_key: string
  search_start?: string
  search_end?: string
  pure_click_yn?: string
}

export interface RefundPolicyParams {
  store_key: string
  item_key: string
  search_start_date: string
  search_end_date: string
  pack_key?: string
}

/**
 * 숙소 상세 도메인 Repository 포트
 */
export interface AccommodationRepository {
  getDetail(params: StoreDetailParams): Promise<DetailsResponse>
  getImages(motelKey: string): Promise<ImagesResponse>
  getDailyBookStatus(motelKey: string, roomKey: string): Promise<DailyBookStatusResponse>
  getRefundPolicy(params: RefundPolicyParams): Promise<RefundPolicyResponse>
}
