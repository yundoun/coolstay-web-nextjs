import type { HttpClient } from "@/lib/ports/HttpClient"
import type { FriendRepository } from "../ports/FriendRepository"
import type { FriendRecommendResponse, FriendRegisterRequest } from "../types"

export class ApiFriendRepository implements FriendRepository {
  constructor(private http: HttpClient) {}

  getFriendRecommend() {
    return this.http.get<FriendRecommendResponse>("/auth/users/friend/list")
  }

  registerFriendCode(body: FriendRegisterRequest) {
    return this.http.post<void>("/auth/users/friend/register", body)
  }
}
