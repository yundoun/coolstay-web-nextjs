// ─── 쿠폰 목록 조회 ───

export interface CouponListParams {
  search_type: string           // ST601(혜택함), ST602, ST603
  sort_type?: string            // RECENT | EXPIRE | PRICE
  search_extra?: string
  book_dt?: string
  book_out_dt?: string
  item_category_code?: string   // 010101(대실), 010102(숙박)
  discount_price?: string
  first_date_discount_price?: string
  cursor?: string
  count?: string
}

export interface CouponConstraint {
  code: string
  value: string
  description: string
}

export interface Coupon {
  coupon_pk: number
  discount_amount: number
  total_amount: number
  remain_amount: number
  code: string
  title: string
  description: string
  category_code: string
  sub_category_code: string
  type: string
  discount_type: string
  dup_use_yn: string
  usable_yn: string
  status: string
  dimmed_yn: string
  start_dt: string
  end_dt: string
  usable_start_dt: string
  usable_end_dt: string
  enterable_start_dt: string
  enterable_end_dt: string
  reg_dt: string
  received: boolean
  constraints: CouponConstraint[]
}

export interface CouponListResponse {
  total_count: number
  remain7day_count: number
  next_cursor: string
  coupons: Coupon[]
}

// ─── 쿠폰 등록 ───

export interface CouponRegisterRequest {
  coupon_code: string
  option_seq?: number
}

export interface CouponOption {
  option_seq: number
  discount_amount: number
  option_title: string
  discount_type: string
}

export interface CouponRegisterResponse {
  coupon_options?: CouponOption[]
}

// ─── 쿠폰 다운로드 ───

export interface CouponDownloadRequest {
  type: string                  // "STORE_DOWNLOAD"
  key: string
}

// ─── 쿠폰 삭제 ───

export interface CouponDeleteRequest {
  coupon_keys: number[]
  flag?: string
}

// ─── Legacy (mock용, API 연동 후 제거) ───

export type CouponDiscountType = "fixed" | "percent"

export interface CouponItem {
  id: string
  title: string
  discountType: CouponDiscountType
  discountValue: number
  minOrderAmount: number
  validFrom: string
  validTo: string
  usageCondition: string
  applicableAccommodations: string
  description: string
  isUsed: boolean
  isExpired: boolean
}
