import { api } from "@/lib/api/client"
import type {
  CouponListParams,
  CouponListResponse,
  CouponRegisterRequest,
  CouponRegisterResponse,
  CouponDownloadRequest,
  CouponDeleteRequest,
} from "../types"

/** 쿠폰 목록 조회 */
export function getCouponList(params: CouponListParams) {
  return api.get<CouponListResponse>("/benefit/coupons/list", params)
}

/** 쿠폰 등록 (코드 입력) */
export function registerCoupon(body: CouponRegisterRequest) {
  return api.post<CouponRegisterResponse>("/benefit/coupons/register", body)
}

/** 쿠폰 다운로드 */
export function downloadCoupon(body: CouponDownloadRequest) {
  return api.post<void>("/benefit/coupons/download", body)
}

/** 쿠폰 삭제 */
export function deleteCoupons(body: CouponDeleteRequest) {
  return api.post<void>("/benefit/coupons/delete", body)
}
