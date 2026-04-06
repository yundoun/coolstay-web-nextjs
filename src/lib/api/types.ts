// CoolStay V2 API 공통 응답 타입

// ─── 공통 ───
export interface Location {
  address: string
  latitude: string
  longitude: string
  description: string
  nearby_description: string
}

export interface ImageItem {
  key: number
  description: string
  url: string
  thumb_url: string
  priority: number
}

export interface LinkItem {
  type: string
  sub_type: string
  target: string
  btn_name: string
  thumb_url: string
  bg_url: string
  bg_color: string
  title_color: string
  mapping_business_types: string[]
}

export interface Rating {
  avg_score: string
  review_count: number
  reviews: Review[]
}

export interface ReviewImage {
  url: string
  thumb_url?: string
  priority?: number
}

export interface Review {
  key: number
  best_yn: string
  item_description: string
  score: string
  text: string
  status: string
  reg_dt: number
  motel?: MotelBasic
  user?: { key: number; name: string }
  comment?: Comment
  status_info?: { start_date: number }
  images?: ReviewImage[]
}

export interface Comment {
  key: number
  text: string
  reg_dt: number
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
  discount_type: string       // "AMOUNT" | "RATE"
  dup_use_yn: string
  usable_yn: string
  status: string
  dimmed_yn: string
  start_dt: number            // 초 단위 timestamp
  end_dt: number              // 초 단위 timestamp
  usable_start_dt: number     // 초 단위 timestamp
  usable_end_dt: number       // 초 단위 timestamp
  enterable_start_dt: number  // 초 단위 timestamp
  enterable_end_dt: number    // 초 단위 timestamp
  reg_dt: number              // 초 단위 timestamp
  day_codes?: string[]
  constraints: { code: string; value: string; description: string }[]
}

// ─── 배너/이벤트 ───
export interface Banner {
  key: number
  view_count: number
  type: string
  sub_type: string
  title: string
  description: string
  position: number
  badge_image_url: string
  banner_image_url: string
  detail_banner_image_url: string
  bottom_image_url: string
  status: string
  webview_link: string
  extra: string
  benefit_more_yn: string
  benefit_preview: string
  thumb_description: string
  image_urls: string[]
  link: LinkItem
  comment: Comment
  buttons: LinkItem
  tags: string[]
  default_sort_type: string
  v2_pull_coupons: Coupon
  v2_total_coupons: Coupon
  reg_dt: string
  start_dt: string
  end_dt: string
}

// ─── 태그/필터 ───
export interface Tag {
  key: number
  type: "FILTER" | "SORT"
  classify: string
  name: string
  priority: number
  filterBit: number
  sortType: string
}

export interface FilterKey {
  v2Key: string
  v2RentKey: string
  v2StayKey: string
  filterBit: number
}

// ─── 숙소 (Motel) ───
export interface MotelBasic {
  key: string
  partnership_type: string
  business_type: string
  name: string
  phone_number: string
  safe_number: string
  location: Location
  images: ImageItem[]
}

// 객실/패키지 아이템 (V1ContentItemVO.ItemObj)
export interface ItemObj {
  key: string
  price: number
  discount_price: number
  consecutive_price: number
  name: string
  description: string
  category: StoreItemCategory
  extras: { code: string; value: string }[]
  keywords?: string[]
  images?: ImageItem[]
  coupons?: Coupon[]
  daily_extras?: DailyExtra[]
  sub_items?: ItemObj[]       // 하위 패키지 (대실/숙박). 예약 시 이 키 사용
  package_priority?: number
  sort_priority?: number
}

export interface Motel extends MotelBasic {
  rating: Rating
  business_info: {
    trade_name: string
    owner_name: string
    address: string
    email: string
    phone_number: string
    business_number: string
  }
  filter_bit: number
  greeting_msg: string
  policy_msg: string
  convenience_codes: string[]
  like_count: number
  distance: string
  benefit_point_rate: number
  user_point_amount: number
  consecutive_yn: string
  user_like_yn: string
  parking_yn: string
  parking_count: number
  parking_full_yn: string
  parking_info: string
  benefit_room: string
  benefit_extra: string
  site_payment_yn: string
  refund_policy: string
  point_reward_type: string
  best_rating: Review
  download_coupon_info: {
    status: string
    coupon_avail_days: number
    stay_amount: number
    rent_amount: number
  }
  items: ItemObj[]                          // 객실 목록 (스펙: List<ItemObj>)
  event: Banner[]                           // 이벤트 정보 (스펙: List<V1BoardVO.Item>)
  benefit_tags: string[]
  benefits: {                               // 혜택 아이콘 (스펙: List<V1BenefitVO.Item>)
    name: string
    description: string
    image_url: string
    active_yn: string
    priority: number
  }[]
  grade_tags: string[]
  coupons: Coupon[]                         // 쿠폰 정보 (스펙: List<V1CouponVO.Item>)
  external_events: Banner[]                 // 숙박대전 이벤트 (스펙: List<V1BoardVO.Item>)
  payment_benefit: {
    benefit_more_yn: string
    benefit_preview: string
    benefit_contents: {
      key: string
      title: string
      start_dt: string
      end_dt: string
      logo_url: string
      contents: string[]
    }
  }
  extra_services: {
    code: string
    name: string
    visible_yn: string
    image_url: string
  }[]
  v2_support_flag: {                        // 스펙: is_ 접두사 (V1ContentItemVO.SupportFlag)
    is_first_reserve: boolean
    is_visit_korea: boolean
    is_low_price_korea: boolean
    is_favor_coupon_store: boolean
    is_unlimited_coupon: boolean
    is_revisit: boolean
  }
  v2_external_links: {
    name: string
    link_url: string
    icon_url: string
    activate: boolean
  }[]
  v2_low_price_btn: LinkItem
  area_cd1: number
  area_cd2: number
  cool_consecutive_popup: boolean
  max_discount_amount?: number              // 최대 할인 금액 (스펙: Long, nullable)
}

// ─── Home API 응답 ───

export interface RegionCategory {
  type: string
  view_type: string
  open_yn: string
  code: string
  name: string
  thumb_url?: string                // 썸네일 URL (1depth에만)
  geometry?: { latitude: string; longitude: string }  // 위경도 (하위 지역에만)
  sub_regions?: RegionCategory[]    // 하위 카테고리 (재귀)
  mapping_business_types?: string[] // 업태 리스트
  depth: number
  priority: number
}

export interface StoreItemCategory {
  code: string
  name: string
}

export interface DailyExtra {
  date: string
  extras: { code: string; value: string }[]
}

export interface StoreItem {
  key: string
  filter_bit: number
  partnership_type?: string
  business_type?: string        // 업태 (MOTEL, HOTEL, PENSION 등)
  name: string
  like_count: number
  distance?: string
  consecutive_yn: string
  user_like_yn: string
  parking_yn: string
  point_reward_type: string
  images: ImageItem[]
  items: ItemObj[]              // 객실 목록 (스펙: List<ItemObj>)
  coupons?: Coupon[]            // 쿠폰 정보 (스펙: List<V1CouponVO.Item>)
  benefit_tags?: string[]       // 혜택 태그
  grade_tags?: string[]         // 등급 태그 (호텔 성급)
  extra_services: { code: string; name: string; visible_yn: string; image_url: string }[]
  area_cd1: number
  area_cd2: number
  cool_consecutive_popup: boolean
  max_discount_amount?: number  // 최대 할인 금액
  v2_support_flag?: {           // V2 지원 플래그
    is_first_reserve: boolean
    is_visit_korea: boolean
    is_low_price_korea: boolean
    is_favor_coupon_store: boolean
    is_unlimited_coupon: boolean
    is_revisit: boolean
  }
  // 상세 조회나 특정 검색 유형(ST006 등)에서 추가 반환되는 필드
  rating?: Rating
  benefit_point_rate?: number
  location?: Location
  download_coupon_info?: {
    status: string
    coupon_avail_days: number
    stay_amount: number
    rent_amount: number
  }
}

export interface HomeBanner {
  key: number
  view_count: number
  type?: string
  title?: string
  description?: string
  badge_image_url?: string
  banner_image_url?: string
  detail_banner_image_url?: string
  thumb_description?: string
  image_urls: string[]
  link: LinkItem
  reg_dt: number
  start_dt?: number              // 게시 시작일 (초 단위)
  end_dt?: number                // 게시 종료일 (초 단위)
}

export interface Exhibition {
  key: number
  view_count: number
  type: string
  title: string
  description: string
  thumb_description?: string
  badge_image_url: string
  banner_image_url: string
  detail_banner_image_url: string
  image_urls: string[]
  link?: { type: string; sub_type: string; target: string; btn_name: string }
  reg_dt: number
  start_dt: number
  end_dt: number
}

export interface AiMagazineBanner {
  key: number
  title?: string               // 실측에서 반환될 수 있음
  description?: string         // 실측에서 반환될 수 있음
  image_url: string
  link?: LinkItem              // 스펙: V1BoardVO.LinkItem (sub_type="A_MR_24")
}

export interface HomeMainResponse {
  recommend_categories: RegionCategory[]
  recommend_stores: StoreItem[]
  item_buttons: LinkItem[]
  new_item_categories: LinkItem[]
  banners: HomeBanner[]
  recent_stores: StoreItem[]
  exhibitions: Exhibition[]
  phrase: string
  valid_book_yn: string
  ai_magazines?: AiMagazineBanner[]
  new_alarm_date?: number
  new_coupon_date?: number
  new_mileage_date?: number
  popups?: Banner[]
  item_categories?: RegionCategory[]
}

export interface RegionStoresResponse {
  recommend_categories: RegionCategory[]
  recommend_stores: StoreItem[]
}

// ─── Contents API 응답 ───

// contents/regions/list
export interface RegionItem {
  type: string
  view_type: string
  open_yn: string
  code: string
  name: string
  thumb_url?: string
  geometry?: { latitude: string; longitude: string }
  sub_regions: RegionItem[]
  depth: number
  priority: number
}

export interface RegionsResponse {
  regions: RegionItem[]
  subways?: RegionItem[]
}

// contents/list — 목록에서 반환되는 motel은 간략형(StoreItem과 유사)
export interface ContentsListResponse {
  total_count: number
  next_cursor: string
  motels: StoreItem[]
  is_during_event?: string
  priority_motels?: StoreItem[]
}

// contents/total/list
export interface SearchResult {
  type: string
  sub_type: string
  entity_id: string
  entity_name: string
  location: Location
  v2_entity_id: string
  v2_keywords: string[]
}

export interface TotalListResponse {
  total_count: number
  keyword_lists?: {
    type: string
    keyword: string
    count: number
  }[]
  search_results: SearchResult[]
}

// contents/filter
export interface FilterResponse {
  total_count: number
  check_in: string
  check_out: string
  adult_count: number
  kids_count: number
  tags?: Tag[]
  filters: FilterKey[]
  banners: Banner[]
}

// contents/filter/list (POST body)
export interface StoreKeys {
  v2Key: string
  v2RentKey: string
  v2StayKey: string
  filterBit: number
  type?: string
}

// contents/myArea/list — motels는 StoreItem 형태 (간략)
export interface MyAreaResponse {
  total_count: number
  tags: Tag[]
  init_tag?: Tag
  motels: StoreItem[]
}

// contents/details/list
export interface DetailsResponse {
  motel: Motel
}

// contents/images/list
export interface ImageCategory {
  category_code: string  // IC003: 대표, IC004: 내부, IC005: 외부, IC006: 장비, IC007: 편의, IC100: 객실
  category_name: string
  images: ImageItem[]
}

export interface ImagesResponse {
  images_per_category: ImageCategory[]
}

// contents/books/daystatus/list
export interface DailyBook {
  date: number       // Unix timestamp
  v2_date: string    // YYYYMMDD
  status: string     // Y: 예약 가능, N: 불가
}

export interface DailyBookStatusResponse {
  daily_books: DailyBook[]
}

// contents/refund-policy/list
export interface RefundPolicy {
  until: string      // 취소 기한 (ex: "3일 전")
  percent: number    // 환불 비율
  amount: number     // 환불 금액
}

export interface RefundPolicyResponse {
  refund_policies: RefundPolicy[]
}

// ─── Reviews API 응답 ───

// contents/reviews/list
export interface ReviewListResponse {
  total_count: number
  next_cursor?: string
  avg_score?: string
  available_count: number
  reviews: Review[]
}

// contents/reviews/register (request body)
export interface ReviewRegisterRequest {
  book_id: string
  motel_key: string
  motel_name: string
  score: string
  description: string
  images?: { oriUrl: string; thumbUrl: string }[]
}

// contents/reviews/update (request body)
export interface ReviewUpdateRequest {
  review_key: string
  score: string
  description: string
  images?: { oriUrl: string; thumbUrl: string }[]
}

// contents/reviews/update (response)
export interface ReviewUpdateResponse {
  review: Review
}

// ─── Reservation API 응답 ───

// reserv/users/payments/list
export interface PaymentMethod {
  pg_code?: string
  method: string
  available_yn: string
  guide_message: string
}

export interface UserPaymentInfoResponse {
  site_payment_usage_cnt: number
  site_payment_base_cnt: number
  noshow_base_time: string
  noshow_block_yn: string
  payment_methods: PaymentMethod[]
}

// reserv/ready (request body)
export interface ReservReadyCouponItem {
  code: string
  title: string
  description: string
  category_code: string
  category_description: string
  type: string
  discount_type: string
  discount_amount: number
  total_amount: number
  remain_amount: number
  dup_use_yn: string
  usable_yn: string
  status: string
  start_dt: string
  end_dt: string
  usable_start_dt: string
  usable_end_dt: string
  day_codes?: string[]
  constraints?: { code: string; value: string; description: string }[]
}

export interface ReservReadyRequest {
  motel_key: string
  item_key: string
  item_type: string
  book_start_dt: string
  book_end_dt: string
  book_user_name: string
  book_user_number: string
  sms_auth_key?: string
  sms_auth_code?: string
  vehicle_yn: string
  price: number
  discount_price: number
  total_price: number
  coupons?: ReservReadyCouponItem[]
  benefit_mileage_rate: number
  mileage?: number
  payment_pg?: string
  payment_method: string
}

// reserv/ready (response)
export interface ReservReadyResponse {
  book_id: string
  status: string
  pull?: unknown
}

// reserv/register (request body)
export interface ReservRegisterRequest {
  payment_pg?: string
  payment_method?: string
  payment_imp_uid?: string
  merchant_uid: string
  item_name?: string
  price?: number
  name?: string
  email?: string
  phone_number?: string
}

// reserv/register (response)
export interface ReservRegisterResponse {
  pull?: unknown
}

// reserv/users/list — BookItem 관련 (snake_case: 실제 API 응답 형식)
export interface BookMotelSimple {
  key: string
  name: string
  phone_number?: string
  safe_number?: string
  partnership_type?: string
  business_type?: string
  location?: Location
  images?: ImageItem[]
}

export interface BookItemSimple {
  key: string
  name: string
  category: { code: string; name: string }
}

export interface BookPaymentSimple {
  pg_code?: string
  method?: string
  imp_uid?: string
  card_name?: string
  charge?: number
  status?: string
  paid_dt?: number
  refund_charge?: number
}

export interface BookRefundPolicyItem {
  until: string
  percent: number
  amount: number
}

export interface BookReviewItem {
  key: number
  score: string
  text: string
}

export interface BookItem {
  book_id: string
  name: string
  phone_number: string
  safe_number?: string
  start_dt: number
  end_dt: number
  reg_dt: number
  vehicle_yn: string
  status: string
  partial_cancel_yn?: string
  partial_refund_yn?: string
  receipt_yn?: string
  refund_yn?: string
  origin_price_total: number
  discount_price_total: number
  discount_price: number
  total_price: number
  used_point?: number
  refund_point?: number
  motel: BookMotelSimple
  items?: BookItemSimple[]
  item_images?: ImageItem[]
  used_coupons?: Coupon[]
  payment?: BookPaymentSimple
  review?: BookReviewItem
  refund_policies?: BookRefundPolicyItem[]
  repr_image?: string
}

export interface BookListResponse {
  total_count: number
  next_cursor?: string
  books: BookItem[]
}

// reserv/guest/list
export interface GuestBookResponse {
  book: BookItem
}

// reserv/delete (request body)
export interface ReservDeleteRequest {
  book_id: string
}

// reserv/users/delete (request body)
export interface ReservUsersDeleteRequest {
  book_id?: string
  flag: "I" | "A"
}

// ─── Keyword API 응답 ───

// contents/total/keywordList
export interface KeywordItem {
  type: string
  keyword: string
  count: number
}

export interface KeywordListResponse {
  total_count: number
  keyword_lists: KeywordItem[]
}
