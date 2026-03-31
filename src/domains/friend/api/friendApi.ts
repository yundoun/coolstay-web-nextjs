import { api } from "@/lib/api/client"
import type { FriendRecommendResponse, FriendRegisterRequest } from "../types"

/** 친구추천 정보 조회 */
export function getFriendRecommend() {
  return api.get<FriendRecommendResponse>("/auth/users/friend/list")
}

/** 친구추천 코드 등록 */
export function registerFriendCode(body: FriendRegisterRequest) {
  return api.post<void>("/auth/users/friend/register", body)
}
