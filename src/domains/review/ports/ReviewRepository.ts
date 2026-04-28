import type {
  ReviewListResponse,
  ReviewRegisterRequest,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
} from "@/lib/api/types"

export interface ReviewListParams {
  search_type: string
  search_extra: string
  count?: number
  cursor?: string
}

/**
 * 리뷰 도메인 Repository 포트
 */
export interface ReviewRepository {
  /** 리뷰 목록 조회 */
  getReviewList(params: ReviewListParams): Promise<ReviewListResponse>
  /** 리뷰 등록 */
  registerReview(body: ReviewRegisterRequest): Promise<void>
  /** 리뷰 수정 */
  updateReview(body: ReviewUpdateRequest): Promise<ReviewUpdateResponse>
  /** 리뷰 삭제 */
  deleteReview(reviewKey: string): Promise<void>
  /** 리뷰 상태 수정 */
  updateReviewStatus(reviewKey: string, status: string): Promise<void>
}
