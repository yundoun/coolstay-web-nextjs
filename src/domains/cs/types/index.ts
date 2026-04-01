// ─── 게시판 공통 (공지/FAQ/문의/가이드/이벤트 공용) ───

export interface BoardListParams {
  board_type: string          // NOTICE | FAQ | INQUIRY | GUIDE | EVENT
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

export interface BoardItem {
  key: number
  type?: string               // "GUIDE" | "VISIT" | "COUPON" 등
  title: string
  description?: string
  badge_image_url?: string
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
  reply?: BoardItemReply
  reply_count?: number
  position?: number
}

export interface BoardItemReply {
  text: string
  reg_dt: number
}

export interface BoardListResponse {
  total_count: number | string
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
