import { api } from "@/lib/api/client"
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

// ─── Users (회원정보) ───

/** 마이페이지 정보 조회 */
export function getMypageInfo() {
  return api.get<MypageInfo>("/auth/users/mypage/list")
}

/** 회원정보 변경 */
export function updateUser(body: UserUpdateRequest) {
  return api.post<UserUpdateResponse>("/auth/users/update", body)
}

/** 비밀번호 확인 */
export function checkPassword(body: PwCheckRequest) {
  return api.post<PwCheckResponse>("/auth/users/pw/check", body)
}

/** 회원 탈퇴 */
export function deleteUser(body: UserDeleteRequest) {
  return api.post<void>("/auth/users/delete", body)
}

// ─── Dibs (찜/즐겨찾기) ───

/** 찜 등록 */
export function registerDibs(body: DibsRegisterRequest) {
  return api.post<DibsRegisterResponse>("/auth/dibs/register", body)
}

/** 찜 삭제 */
export function deleteDibs(body: DibsDeleteRequest) {
  return api.post<void>("/auth/dibs/delete", body)
}

/** 찜 목록 조회 (contents/list search_type=ST006) */
export function getDibsList(params?: { count?: number; cursor?: string }) {
  return api.get<ContentsListResponse>("/contents/list", {
    search_type: "ST006",
    count: params?.count ?? 20,
    cursor: params?.cursor,
  })
}
