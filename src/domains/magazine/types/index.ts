import type { LinkItem, StoreItem } from "@/lib/api/types"

// ─── 매거진 홈 (/aiMagazine/home) ───

export interface MagazineBanner {
  key: number
  image_url: string
  link?: LinkItem
}

export interface MagazineVideo {
  key: number
  thumbnail_url: string
  sub_type: string          // "VIDEO" | "COLUMN" | "REVIEW_DINING"
  link?: LinkItem
}

export interface MagazineBoard {
  key: number
  thumbnail_url: string
  sub_type: string          // "VIDEO" | "COLUMN" | "REVIEW_DINING"
  link?: LinkItem
}

export interface MagazinePackage {
  key: number
  image_url: string
  link?: LinkItem
}

export interface MagazineHomeResponse {
  magazine_banner: MagazineBanner[]
  magazine_video: MagazineVideo[]
  magazine_board: MagazineBoard[]
  magazine_package: MagazinePackage[]
}

// ─── 지역 선택 (/aiMagazine/regions) ───

export interface District {
  provinceCode: number
  code: number
  name: string
  displayName?: string      // "전체" 항목에만 존재
  lat?: number
  lng?: number
}

export interface Province {
  code: number | null        // 0=전국, null 가능
  name: string
  districts: District[]
}

export interface RegionsResponse {
  provinces: Province[]
}

// ─── 게시글 목록 (/aiMagazine/board/list) ───

export type BoardType = "ALL" | "VIDEO" | "COLUMN" | "REVIEW_DINING"

export interface BoardSummary {
  key: number
  type: string              // 한글: "영상" | "칼럼" | "맛집 후기"
  thumbnail_url: string
  link?: LinkItem
  title: string
  sub_title?: string
}

export interface BoardListResponse {
  total_count: number
  next_cursor?: string
  boards: BoardSummary[]
}

// ─── 게시글 상세 (/aiMagazine/board/detail) ───

export interface PackageBanner {
  package_key?: number
  banner_image_url?: string
}

export interface BoardDetail {
  key: number
  title: string
  sub_title?: string
  profile_image_url?: string
  writer_name?: string
  writer_introduction?: string
  post_date?: string         // "yyyy.MM.dd"
  description?: string       // HTML 본문
  package_banner?: PackageBanner
  motels?: StoreItem[]       // 추천 숙소 (최대 10개)
}

export interface BoardDetailResponse {
  board_detail: BoardDetail
}

// ─── 패키지 목록 (/aiMagazine/package/list) ───

export interface BoardItem {
  key: number
  view_count?: number
  type?: string              // "PACKAGE"
  title: string
  description?: string       // HTML
  banner_image_url?: string
  detail_banner_image_url?: string
  thumb_description?: string
  image_urls?: string[]
  tags?: string[]
  default_sort_type?: string
  linked_stores?: StoreItem[]
  v2_total_coupons?: CouponItem[]
  v2_pull_coupons?: CouponItem[]
  start_dt?: number          // 초 단위 timestamp
  end_dt?: number
  reg_dt?: number
  bottom_image_url?: string
}

export interface CouponItem {
  coupon_pk: number
  discount_amount: number
  total_amount: number
  remain_amount: number
  code: string
  title: string
  description: string
  category_code: string
  type: string
  discount_type: string
  status: string
  start_dt: number
  end_dt: number
}

export interface PackageListResponse {
  total_count: number
  next_cursor?: string
  board_items: BoardItem[]
}

// ─── 패키지 상세 (/aiMagazine/package/detail) ───

export interface PackageDetailResponse {
  board_items: BoardItem[]
  sortTags?: string[]
  bottomImageUrl?: string
  mainCoupons?: unknown[]
}

// ─── 패키지 배너 (/aiMagazine/package/banner) ───

export interface PackageBannerItem {
  package_key: number
  banner_image_url: string
  link?: LinkItem
}

export interface PackageBannerResponse {
  package_banners: PackageBannerItem[]
}
