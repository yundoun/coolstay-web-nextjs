import type { TokenManager } from "@/lib/ports/TokenManager"
import type { TokenPair } from "@/lib/api/client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

/**
 * API 기반 TokenManager 구현체
 *
 * 현재 client.ts의 토큰 관리 로직을 캡슐화:
 * - 임시 토큰 자동 발급
 * - 로그인 토큰 설정/해제
 * - 토큰 재발급 직렬화 (동시 요청 보호)
 * - 인증 에러 콜백
 */
export class ApiTokenManager implements TokenManager {
  private cachedToken: TokenPair | null = null
  private isUserToken = false
  private tokenPromise: Promise<TokenPair> | null = null
  private refreshPromise: Promise<TokenPair> | null = null
  private authErrorHandler: (() => void) | null = null

  async getToken(): Promise<TokenPair> {
    if (this.refreshPromise) return this.refreshPromise
    if (this.cachedToken) return this.cachedToken
    if (this.tokenPromise) return this.tokenPromise

    this.tokenPromise = this.fetchTemporaryToken()
    try {
      return await this.tokenPromise
    } finally {
      this.tokenPromise = null
    }
  }

  setToken(token: TokenPair): void {
    this.cachedToken = token
    this.isUserToken = true
  }

  clearToken(): void {
    this.cachedToken = null
    this.isUserToken = false
  }

  isAuthenticated(): boolean {
    return this.isUserToken && this.cachedToken !== null
  }

  onAuthError(handler: (() => void) | null): void {
    this.authErrorHandler = handler
  }

  /**
   * 토큰 에러 발생 시 호출
   * - 로그인 토큰이었으면 authErrorHandler 호출 (로그아웃)
   * - 토큰 초기화 후 새 임시 토큰 발급
   * - 동시 호출 직렬화
   */
  async handleTokenError(): Promise<TokenPair> {
    if (this.refreshPromise) return this.refreshPromise

    if (this.isUserToken) {
      this.authErrorHandler?.()
    }
    this.cachedToken = null
    this.isUserToken = false

    this.refreshPromise = this.fetchTemporaryToken()
    try {
      const token = await this.refreshPromise
      this.cachedToken = token
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  private async fetchTemporaryToken(): Promise<TokenPair> {
    const res = await fetch(`${BASE_URL}/auth/sessions/temporary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    const token = data.result?.token
    if (token?.access_token && token?.secret) {
      const pair: TokenPair = { accessToken: token.access_token, secret: token.secret }
      this.cachedToken = pair
      return pair
    }
    throw new Error("토큰 발급 실패")
  }
}
