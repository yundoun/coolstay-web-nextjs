import type { HttpClient } from "@/lib/ports/HttpClient"
import type { CouponRepository } from "../ports/CouponRepository"
import type {
  CouponListParams,
  CouponListResponse,
  CouponRegisterRequest,
  CouponRegisterResponse,
  CouponDownloadRequest,
  CouponDeleteRequest,
} from "../types"

export class ApiCouponRepository implements CouponRepository {
  constructor(private http: HttpClient) {}

  getCouponList(params: CouponListParams) {
    return this.http.get<CouponListResponse>("/benefit/coupons/list", {
      ...params,
    })
  }

  registerCoupon(body: CouponRegisterRequest) {
    return this.http.post<CouponRegisterResponse>("/benefit/coupons/register", body)
  }

  downloadCoupon(body: CouponDownloadRequest) {
    return this.http.post<void>("/benefit/coupons/download", body)
  }

  deleteCoupons(body: CouponDeleteRequest) {
    return this.http.post<void>("/benefit/coupons/delete", body)
  }
}
