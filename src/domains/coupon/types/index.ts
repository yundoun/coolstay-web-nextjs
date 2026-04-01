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
  code: string                  // CC001, CC002, CC004, CC005, CC007 등
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
  category_code: string         // "STEP3" 등
  sub_category_code: string     // "AUTO" 등
  type: string                  // "PACKAGE" 등
  discount_type: string         // "AMOUNT" | "RATE"
  dup_use_yn: string
  usable_yn: string
  status: string                // "C001" 등
  dimmed_yn: string
  start_dt: number              // 초 단위 timestamp
  end_dt: number                // 초 단위 timestamp
  usable_start_dt: number       // 초 단위 timestamp
  usable_end_dt: number         // 초 단위 timestamp
  enterable_start_dt: number    // 초 단위 timestamp
  enterable_end_dt: number      // 초 단위 timestamp
  reg_dt: number                // 초 단위 timestamp
  day_codes: string[]
  constraints: CouponConstraint[]
}

export interface CouponListResponse {
  total_count: number
  remain7day_count: number
  next_cursor?: string
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
