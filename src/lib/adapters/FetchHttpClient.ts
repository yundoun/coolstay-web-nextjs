import type { HttpClient, HttpParams } from "@/lib/ports/HttpClient"
import type { ApiTokenManager } from "./ApiTokenManager"
import { generateSecretCode } from "@/lib/api/encrypt"
import { SUCCESS_CODE, TOKEN_ERROR_CODES } from "@/lib/constants/apiCodes"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

interface ApiResponse<T> {
  code: string
  desc: string
  result: T
}

/**
 * fetch 기반 HttpClient 구현체
 *
 * TokenManager를 주입받아 토큰 관리를 위임한다.
 * 토큰 에러 시 자동 재발급 + 재시도 로직 포함.
 */
export class FetchHttpClient implements HttpClient {
  constructor(private tokenManager: ApiTokenManager) {}

  async get<T>(path: string, params?: HttpParams): Promise<T> {
    return this.request<T>(path, { method: "GET", params })
  }

  async post<T>(path: string, body?: unknown, params?: HttpParams): Promise<T> {
    return this.request<T>(path, { method: "POST", body, params })
  }

  private buildUrl(path: string, params?: HttpParams): string {
    let fullPath = `${BASE_URL}${path}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value))
        }
      })
      const qs = searchParams.toString()
      if (qs) fullPath += `?${qs}`
    }
    return fullPath
  }

  private async request<T>(
    path: string,
    options: { method: string; body?: unknown; params?: HttpParams },
  ): Promise<T> {
    const { method, body, params } = options
    const token = await this.tokenManager.getToken()
    const secretCode = await generateSecretCode(token.accessToken, token.secret)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "app-token": token.accessToken,
      "app-secret-code": secretCode,
    }

    const url = this.buildUrl(path, params)
    const fetchInit: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }

    const response = await fetch(url, fetchInit)

    let data: ApiResponse<T>
    try {
      data = await response.json()
    } catch {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    // 토큰 에러 처리
    if (TOKEN_ERROR_CODES.has(data.code)) {
      const newToken = await this.tokenManager.handleTokenError()
      const newSecretCode = await generateSecretCode(newToken.accessToken, newToken.secret)
      headers["app-token"] = newToken.accessToken
      headers["app-secret-code"] = newSecretCode

      const retryResponse = await fetch(this.buildUrl(path, params), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
      const retryData: ApiResponse<T> = await retryResponse.json()
      if (retryData.code === SUCCESS_CODE) {
        return retryData.result
      }
      throw new Error(`API Error: ${retryData.code} ${retryData.desc}`)
    }

    if (data.code !== SUCCESS_CODE) {
      throw new Error(`API Error: ${data.code} ${data.desc}`)
    }

    return data.result
  }
}
