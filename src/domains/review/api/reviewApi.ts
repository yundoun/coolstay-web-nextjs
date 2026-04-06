import { api } from "@/lib/api/client"
import type {
  ReviewListResponse,
  ReviewRegisterRequest,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
} from "@/lib/api/types"

// ─── 리뷰 목록 조회 ───

// 리뷰 검색 타입 (ReviewSearchType)
export const REVIEW_SEARCH_TYPE = {
  /** 제휴점 후기 (search_extra = motel_key) */
  STORE: "SR001",
  /** 나의 후기 */
  MY: "SR002",
  /** 후기 상세 (search_extra = review_key) */
  DETAIL: "SR003",
} as const

export interface ReviewListParams {
  search_type: string    // SR001: 제휴점 후기, SR002: 나의 후기, SR003: 후기 상세
  search_extra: string   // motel_key 또는 review_key
  count?: number
  cursor?: string
}

export function getReviewList(params: ReviewListParams) {
  return api.get<ReviewListResponse>("/contents/reviews/list", { ...params } as Record<string, string | number | boolean | undefined>)
}

// ─── 리뷰 등록 ───
export function registerReview(body: ReviewRegisterRequest) {
  return api.post<void>("/contents/reviews/register", body)
}

// ─── 리뷰 수정 ───
export function updateReview(body: ReviewUpdateRequest) {
  return api.post<ReviewUpdateResponse>("/contents/reviews/update", body)
}

// ─── 리뷰 삭제 ───
export function deleteReview(reviewKey: string) {
  return api.post<void>("/contents/reviews/delete", { review_key: reviewKey })
}

// ─── 리뷰 상태 수정 ───
export function updateReviewStatus(reviewKey: string, status: string) {
  return api.post<void>("/contents/reviews/status/update", {
    review_key: reviewKey,
    status,
  })
}
