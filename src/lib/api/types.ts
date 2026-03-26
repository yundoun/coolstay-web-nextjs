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

export interface Review {
  key: number
  best_yn: string
  item_description: string
  score: string
  text: string
  status: string
  reg_dt: string
  motel?: MotelBasic
  comment?: Comment
  images?: ImageItem[]
}

export interface Comment {
  key: number
  text: string
  reg_dt: string
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
  items: {
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
  }[]
  event: Banner
  benefit_tags: string[]
  benefits: {
    name: string
    description: string
    image_url: string
    active_yn: string
    priority: number
  }
  grade_tags: string[]
  coupons: Coupon
  external_events: Banner
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
  v2_support_flag: {
    first_reserve: boolean
    visit_korea: boolean
    low_price_korea: boolean
    favor_coupon_store: boolean
    unlimited_coupon: boolean
    revisit: boolean
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
}

// ─── Home API 응답 ───

export interface RegionCategory {
  type: string
  view_type: string
  open_yn: string
  code: string
  name: string
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

export interface StoreRoomItem {
  key: string
  price: number
  discount_price: number
  consecutive_price: number
  name: string
  category: StoreItemCategory
  coupons?: Coupon[]
  daily_extras?: DailyExtra[]
}

export interface StoreItem {
  key: string
  filter_bit: number
  name: string
  like_count: number
  consecutive_yn: string
  user_like_yn: string
  parking_yn: string
  point_reward_type: string
  images: ImageItem[]
  items: StoreRoomItem[]
  extra_services: { code: string; name: string; visible_yn: string; image_url: string }[]
  area_cd1: number
  area_cd2: number
  cool_consecutive_popup: boolean
}

export interface HomeBanner {
  key: number
  view_count: number
  image_urls: string[]
  link: LinkItem
  reg_dt: number
}

export interface Exhibition {
  key: number
  view_count: number
  type: string
  title: string
  description: string
  badge_image_url: string
  banner_image_url: string
  detail_banner_image_url: string
  image_urls: string[]
  reg_dt: number
  start_dt: number
  end_dt: number
}

export interface AiMagazineBanner {
  key: number
  title: string
  description: string
  image_url: string
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

// ─── Contents API 응답 (기존) ───
export interface FilterResponse {
  total_count: number
  check_in: string
  check_out: string
  adult_count: number
  kids_count: number
  tags: Tag[]
  filters: FilterKey[]
  banners: Banner[]
}

export interface MyAreaResponse {
  total_count: number
  tags: Tag[]
  init_tag: Tag
  motels: Motel[]
}

export interface TotalListResponse {
  total_count: number
  keyword_lists: {
    type: string
    keyword: string
    count: number
  }
  search_results: {
    type: string
    sub_type: string
    entity_id: string
    entity_name: string
    location: Location
    v2_entity_id: string
    v2_keywords: string[]
  }[]
}

export interface DetailsResponse {
  motel: Motel
}

export interface RegionsResponse {
  code: string
  desc: string
  result: unknown
}
