import type { FriendRecommendResponse, FriendRegisterRequest } from "../types"

/**
 * 친구추천 도메인 Repository 포트
 */
export interface FriendRepository {
  /** 친구추천 정보 조회 */
  getFriendRecommend(): Promise<FriendRecommendResponse>
  /** 친구추천 코드 등록 */
  registerFriendCode(body: FriendRegisterRequest): Promise<void>
}
