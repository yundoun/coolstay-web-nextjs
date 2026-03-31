// ─── API 타입 ───

export interface EventBoardItem {
  key: string
  type: string
  title: string
  description: string
  banner_image_url?: string
  start_dt?: number
  end_dt?: number
  status?: string
  link?: string
  web_view_link?: string
}

export interface EventListResponse {
  events: EventBoardItem[]
}

export interface EventListParams {
  search_type?: string
  status?: string
  count?: number
  cursor?: string
}

// ─── Legacy (mock용) ───

export type EventStatus = "ongoing" | "upcoming" | "ended"

export interface EventItem {
  id: string
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  status: EventStatus
  hasCoupon: boolean
  couponName?: string
}
