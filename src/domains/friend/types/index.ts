// ─── 친구추천 조회 ───

export interface InviteRanker {
  nickname: string
  rank: number
}

export interface FriendInfo {
  reg_user_count: number
  my_recommend_code: string
  update_dt: string
  image_url: string
  ranking_visible_yn: boolean
  recommend_users: InviteRanker[]
}

export interface FriendRecommendResponse {
  friend_event: unknown | null
  friend_info: FriendInfo | null
  button: { url: string; text: string } | null
}

// ─── 친구추천 등록 ───

export interface FriendRegisterRequest {
  recommend_code: string
}
