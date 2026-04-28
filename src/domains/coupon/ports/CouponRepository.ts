import type {
  CouponListParams,
  CouponListResponse,
  CouponRegisterRequest,
  CouponRegisterResponse,
  CouponDownloadRequest,
  CouponDeleteRequest,
} from "../types"

/**
 * 쿠폰 도메인 Repository 포트
 */
export interface CouponRepository {
  /** 쿠폰 목록 조회 */
  getCouponList(params: CouponListParams): Promise<CouponListResponse>
  /** 쿠폰 등록 (코드 입력) */
  registerCoupon(body: CouponRegisterRequest): Promise<CouponRegisterResponse>
  /** 쿠폰 다운로드 */
  downloadCoupon(body: CouponDownloadRequest): Promise<void>
  /** 쿠폰 삭제 */
  deleteCoupons(body: CouponDeleteRequest): Promise<void>
}
