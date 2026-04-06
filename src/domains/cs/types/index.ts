// ─── 게시판 공통 (공지/FAQ/문의/가이드/이벤트 공용) ───

export interface BoardListParams {
  board_type: string          // NOTICE | FAQ | ASK | GUIDE | EVENT
  status?: string
  count?: number
  board_item_key?: string
  cursor?: string
}

export interface BoardItemLink {
  type: string                // "APP_LINK" | "URL" | "URL_DETAIL" 등
  sub_type: string
  target: string
  btn_name: string
}

export interface BoardItemSortTag {
  key: number
  type: string                // "SORT"
  classify: string            // "INFINITE_BENEFITS_SORT" 등
  name: string
  priority: number
  filterBit: number
  sortType: string            // "BENEFIT_UNLIMITED" 등
}

export interface BoardItem {
  key: number
  type?: string               // "GUIDE" | "VISIT" | "COUPON" | "EXHIBITION" 등
  title: string
  description?: string
  badge_image_url?: string
  banner_image_url?: string   // 기획전(EXHIBITION)에서 사용
  detail_banner_image_url?: string
  image_urls?: string[]
  webview_link?: string
  link?: BoardItemLink
  buttons?: BoardItemLink[]
  thumb_description?: string
  view_count?: number
  status?: string             // "BI005" 등 코드값
  start_dt?: number           // 초 단위 timestamp
  end_dt?: number             // 초 단위 timestamp
  reg_dt?: number             // 초 단위 timestamp
  tags?: string[]
  sort_tags?: BoardItemSortTag[]  // 기획전 정렬 태그
  default_sort_type?: string     // 기획전 기본 정렬 (스펙: SortType)
  linked_stores?: import("@/lib/api/types").StoreItem[]  // 기획전 연관 제휴점
  v2_pull_coupons?: import("@/lib/api/types").Coupon[]   // 땡겨요 쿠폰
  v2_total_coupons?: import("@/lib/api/types").Coupon[]  // 쿠폰 전체 받기
  bottom_image_url?: string      // 이벤트 하단 이미지
  extra?: string                 // 부가 정보
  benefit_more_yn?: string       // 결제 혜택 더보기 여부
  benefit_preview?: string       // 결제 혜택 미리보기
  reply?: BoardItemReply         // 1:1 문의 답변 (스펙: comment → ReplyItem)
  reply_count?: number
  position?: number
}

export interface BoardItemReply {
  key?: number
  text: string
  reg_dt: number
  user?: { key: number; name: string }  // 스펙: V1UserVO.Simple
}

export interface BoardListResponse {
  total_count: number
  next_cursor?: string
  board_items: BoardItem[]
}

// ─── 게시판 등록 (1:1 문의) ───

export interface BoardRegisterRequest {
  board_type: string
  title: string
  option_value?: string
  images?: { url: string; key: string }[]
}

// ─── 게시판 삭제 ───

export interface BoardDeleteRequest {
  board_type: string
  item_key: string
}

// ─── 인기 검색어 ───

export interface PopularKeywordItem {
  ranking: number
  keyword: string
}

export interface PopularKeywordResponse {
  date: string                    // yyyy.MM.dd
  popular_keywords: PopularKeywordItem[]
}
