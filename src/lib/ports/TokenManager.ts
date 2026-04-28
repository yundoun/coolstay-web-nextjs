import type { TokenPair } from "@/lib/api/client"

/**
 * 토큰 관리 포트
 *
 * 임시 토큰 발급, 로그인 토큰 설정/해제, 인증 에러 콜백 등
 * 토큰 생명주기를 추상화한다.
 */
export interface TokenManager {
  getToken(): Promise<TokenPair>
  setToken(token: TokenPair): void
  clearToken(): void
  isAuthenticated(): boolean
  onAuthError(handler: (() => void) | null): void
}
