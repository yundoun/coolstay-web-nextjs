// ─── 쿠폰 검색/정렬 상수 ───

/** 쿠폰 검색 타입 */
export const COUPON_SEARCH_TYPE = {
  /** 혜택함 — 내 쿠폰 목록 */
  MY_BOX: "ST601",
  /** 예약 — 예약 시 사용 가능 쿠폰 (item_category_code 필수) */
  RESERVATION: "ST602",
  /** 선착순 즉시할인 — 숙소 상세에서 표시 */
  FIRST_COME: "ST603",
} as const

/** 쿠폰 정렬 타입 (ST601 전용) */
export const COUPON_SORT_TYPE = {
  /** 추천순 (기본값, NONE/PRICE와 동일) */
  BENEFIT: "DISCOUNT_BENEFIT",
  /** 최신순 (다운로드 날짜) */
  RECENT: "DOWNLOAD_DATE_DESC",
  /** 만료임박순 */
  EXPIRE: "EXPIRED_DATE_ASC",
} as const

// ─── 쿠폰 목록 조회 ───

export interface CouponListParams {
  search_type: string           // ST601(혜택함), ST602(예약), ST603(선착순)
  sort_type?: string            // DISCOUNT_BENEFIT | DOWNLOAD_DATE_DESC | EXPIRED_DATE_ASC
  search_extra?: string
  book_dt?: string
  book_out_dt?: string
  item_category_code?: string   // 010101(대실), 010102(숙박) — ST602 필수
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
  remain_7day_count: number      // 스펙: remain_7day_count (snake_case)
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

/** 쿠폰 다운로드 타입 */
export const COUPON_DOWNLOAD_TYPE = {
  /** 찜 쿠폰 */
  STORE_DOWNLOAD: "STORE_DOWNLOAD",
  /** 첫예약 쿠폰 */
  FIRST_RESERVATION: "FIRST_RESERVATION_COUPON_DN",
  /** 기획전 쿠폰 */
  EXHIBITION: "EXHIBITION",
  /** 매거진/패키지 쿠폰 */
  PACKAGE: "PACKAGE",
  /** 일반 다운로드 */
  COUPON_DN: "COUPON_DN",
  /** 신규 회원 쿠폰 */
  NEWBIE: "NEWBIE_COUPON_DN",
} as const

export interface CouponDownloadRequest {
  type: string                  // COUPON_DOWNLOAD_TYPE 중 하나
  key: string
}

// ─── 쿠폰 삭제 ───

export interface CouponDeleteRequest {
  coupon_keys: number[]
  flag?: string
}
