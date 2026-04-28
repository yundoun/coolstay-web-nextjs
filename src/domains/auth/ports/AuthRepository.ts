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

/**
 * 인증 도메인 Repository 포트
 */
export interface AuthRepository {
  /** 이메일 로그인 */
  loginWithEmail(body: LoginRequest): Promise<SessionResponse>
  /** 소셜 로그인 */
  loginWithSns(body: SnsLoginRequest): Promise<SessionResponse>
  /** 인증번호 발송 */
  sendAuthCode(body: CodeSendRequest): Promise<CodeSendResponse>
  /** 인증번호 확인 */
  checkAuthCode(body: CodeCheckRequest): Promise<CodeCheckResponse>
  /** 인증수단 조회 */
  getAuthMethods(email: string): Promise<AuthMethodResponse>
  /** 이메일 회원가입 */
  registerWithEmail(body: RegisterRequest): Promise<SessionResponse>
  /** 소셜 회원가입 */
  registerWithSns(body: SnsRegisterRequest): Promise<SessionResponse>
  /** 비밀번호 찾기 */
  findPassword(body: PwFindRequest): Promise<PwFindResponse>
  /** 아이디 찾기 */
  findUserId(body: IdFindRequest): Promise<unknown>
}
