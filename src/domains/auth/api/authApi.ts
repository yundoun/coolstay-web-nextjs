import { api } from "@/lib/api/client"
import type {
  SessionResponse,
  LoginRequest,
  SnsLoginRequest,
  CodeSendRequest,
  CodeSendResponse,
  CodeCheckRequest,
  CodeCheckResponse,
  AuthMethodResponse,
  RegisterRequest,
  SnsRegisterRequest,
  PwFindRequest,
  PwFindResponse,
  IdFindRequest,
} from "../types"

// ─── Session (로그인) ───

/** 이메일 로그인 */
export function loginWithEmail(body: LoginRequest) {
  return api.post<SessionResponse>("/auth/sessions/users", body)
}

/** 소셜 로그인 */
export function loginWithSns(body: SnsLoginRequest) {
  return api.post<SessionResponse>("/auth/sessions/users/sns", body)
}

// ─── Auth Code (인증코드) ───

/** 인증번호 발송 (SMS 또는 이메일) */
export function sendAuthCode(body: CodeSendRequest) {
  return api.post<CodeSendResponse>("/auth/code/send", body)
}

/** 인증번호 확인 */
export function checkAuthCode(body: CodeCheckRequest) {
  return api.post<CodeCheckResponse>("/auth/code/check", body)
}

/** 인증수단 조회 (비밀번호 재설정 시) */
export function getAuthMethods(email: string) {
  return api.get<AuthMethodResponse>("/auth/code/list", { email })
}

// ─── Users (회원가입) ───

/** 이메일 회원가입 */
export function registerWithEmail(body: RegisterRequest) {
  return api.post<SessionResponse>("/auth/users/register", body)
}

/** 소셜 회원가입 */
export function registerWithSns(body: SnsRegisterRequest) {
  return api.post<SessionResponse>("/auth/users/sns/register", body)
}

// ─── 계정 찾기 ───

/** 비밀번호 찾기 (임시 비밀번호 발급) */
export function findPassword(body: PwFindRequest) {
  return api.post<PwFindResponse>("/auth/users/pw/find", body)
}

/** 아이디 찾기 */
export function findUserId(body: IdFindRequest) {
  return api.post<unknown>("/auth/users/id/find", body)
}
