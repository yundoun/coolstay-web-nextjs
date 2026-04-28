import type { HttpClient } from "@/lib/ports/HttpClient"
import type { MypageRepository } from "../ports/MypageRepository"
import type { ContentsListResponse } from "@/lib/api/types"
import type {
  MypageInfo,
  UserUpdateRequest,
  UserUpdateResponse,
  PwCheckRequest,
  PwCheckResponse,
  UserDeleteRequest,
  DibsRegisterRequest,
  DibsRegisterResponse,
  DibsDeleteRequest,
} from "../types"

export class ApiMypageRepository implements MypageRepository {
  constructor(private http: HttpClient) {}

  getMypageInfo() {
    return this.http.get<MypageInfo>("/auth/users/mypage/list")
  }

  updateUser(body: UserUpdateRequest) {
    return this.http.post<UserUpdateResponse>("/auth/users/update", body)
  }

  checkPassword(body: PwCheckRequest) {
    return this.http.post<PwCheckResponse>("/auth/users/pw/check", body)
  }

  deleteUser(body: UserDeleteRequest) {
    return this.http.post<void>("/auth/users/delete", body)
  }

  registerDibs(body: DibsRegisterRequest) {
    return this.http.post<DibsRegisterResponse>("/auth/dibs/register", body)
  }

  deleteDibs(body: DibsDeleteRequest) {
    return this.http.post<void>("/auth/dibs/delete", body)
  }

  getDibsList(params?: { count?: number; cursor?: string }) {
    return this.http.get<ContentsListResponse>("/contents/list", {
      search_type: "ST006",
      count: params?.count ?? 20,
      cursor: params?.cursor,
    })
  }
}
