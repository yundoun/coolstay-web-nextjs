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

/**
 * 마이페이지 도메인 Repository 포트
 */
export interface MypageRepository {
  /** 마이페이지 정보 조회 */
  getMypageInfo(): Promise<MypageInfo>
  /** 회원정보 변경 */
  updateUser(body: UserUpdateRequest): Promise<UserUpdateResponse>
  /** 비밀번호 확인 */
  checkPassword(body: PwCheckRequest): Promise<PwCheckResponse>
  /** 회원 탈퇴 */
  deleteUser(body: UserDeleteRequest): Promise<void>
  /** 찜 등록 */
  registerDibs(body: DibsRegisterRequest): Promise<DibsRegisterResponse>
  /** 찜 삭제 */
  deleteDibs(body: DibsDeleteRequest): Promise<void>
  /** 찜 목록 조회 */
  getDibsList(params?: { count?: number; cursor?: string }): Promise<ContentsListResponse>
}
