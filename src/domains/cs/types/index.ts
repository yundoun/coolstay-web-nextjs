// ─── 게시판 공통 (공지/FAQ/문의 공용) ───

export interface BoardListParams {
  board_type: string          // NOTICE | FAQ | INQUIRY
  status?: string
  count?: number
  board_item_key?: string
  cursor?: string
}

export interface BoardItemImage {
  url: string
  key?: string
}

export interface BoardItemReply {
  text: string
  reg_dt: number
}

export interface BoardItem {
  key: string
  type: string
  title: string
  description: string
  images?: BoardItemImage[]
  banner_image_url?: string
  start_dt?: number
  end_dt?: number
  status: string
  tags?: string[]
  link?: string
  web_view_link?: string
  reply?: BoardItemReply
  reply_count?: number
  view_count?: number
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
