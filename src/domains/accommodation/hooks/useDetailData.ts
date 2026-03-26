import { useQuery } from "@tanstack/react-query"
import {
  getStoreDetail,
  getStoreImages,
  getDailyBookStatus,
  getRefundPolicy,
} from "../api/detailApi"

// 숙소 상세 정보
export function useStoreDetail(
  motelKey: string | undefined,
  dates?: { start: string; end: string },
) {
  return useQuery({
    queryKey: ["contents", "detail", motelKey, dates],
    queryFn: () =>
      getStoreDetail({
        motel_key: motelKey!,
        search_start: dates?.start,
        search_end: dates?.end,
      }),
    enabled: !!motelKey,
    retry: 1,
  })
}

// 이미지 목록 (카테고리별)
export function useStoreImages(motelKey: string | undefined) {
  return useQuery({
    queryKey: ["contents", "images", motelKey],
    queryFn: () => getStoreImages(motelKey!),
    enabled: !!motelKey,
    retry: 1,
  })
}

// 일별 예약 가능여부
export function useDailyBookStatus(
  motelKey: string | undefined,
  roomKey: string | undefined,
) {
  return useQuery({
    queryKey: ["contents", "dailyBook", motelKey, roomKey],
    queryFn: () => getDailyBookStatus(motelKey!, roomKey!),
    enabled: !!motelKey && !!roomKey,
    retry: 1,
  })
}

// 취소/환불 규정
export function useRefundPolicy(
  params:
    | {
        store_key: string
        item_key: string
        search_start_date: string
        search_end_date: string
      }
    | undefined,
) {
  return useQuery({
    queryKey: ["contents", "refundPolicy", params],
    queryFn: () => getRefundPolicy(params!),
    enabled: !!params,
    retry: 1,
  })
}
