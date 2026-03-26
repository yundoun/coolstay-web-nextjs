import { api } from "@/lib/api/client"
import type {
  DetailsResponse,
  ImagesResponse,
  DailyBookStatusResponse,
  RefundPolicyResponse,
} from "@/lib/api/types"

// ─── 숙소 상세 정보 ───
export function getStoreDetail(params: {
  motel_key: string
  search_start?: string   // YYYYMMDD
  search_end?: string     // YYYYMMDD
  pure_click_yn?: string  // Y/N (조회수 카운트 여부)
}) {
  return api.get<DetailsResponse>("/contents/details/list", {
    ...params,
    pure_click_yn: params.pure_click_yn ?? "N",
  })
}

// ─── 이미지 목록 ───
export function getStoreImages(motelKey: string) {
  return api.get<ImagesResponse>("/contents/images/list", {
    motel_key: motelKey,
  })
}

// ─── 일별 예약 가능여부 ───
export function getDailyBookStatus(motelKey: string, roomKey: string) {
  return api.get<DailyBookStatusResponse>("/contents/books/daystatus/list", {
    motel_key: motelKey,
    room_key: roomKey,
  })
}

// ─── 취소/환불 규정 ───
export function getRefundPolicy(params: {
  store_key: string
  item_key: string
  search_start_date: string  // YYYYMMDD
  search_end_date: string    // YYYYMMDD
  pack_key?: string
}) {
  return api.get<RefundPolicyResponse>("/contents/refund-policy/list", params)
}
