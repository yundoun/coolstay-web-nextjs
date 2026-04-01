// ─── 친구추천 조회 ───

export interface InviteRanker {
  nickname: string
  rank: number
}

export interface FriendEvent {
  view_count: number
  image_urls: string[]
}

export interface FriendInfo {
  reg_user_count: number
  my_recommend_code: string
  update_dt: number              // 초 단위 timestamp (실제 응답: number)
  image_url: string
  ranking_visible_yn: boolean
  recommend_users?: InviteRanker[]  // 실제 응답에서 미반환 시 optional
}

export interface FriendButton {
  type: string       // "APP_LINK" 등 (BoardItemLink 동일 구조)
  sub_type: string   // "A_AF_02" 등
  target: string
  btn_name: string
  thumb_url?: string // 친구추천 버튼 전용 썸네일
}

export interface FriendRecommendResponse {
  friend_event: FriendEvent | null
  friend_info: FriendInfo | null
  button: FriendButton | null
}

// ─── 친구추천 등록 ───

export interface FriendRegisterRequest {
  recommend_code: string
}
