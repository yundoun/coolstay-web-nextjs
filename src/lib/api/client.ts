import { generateSecretCode, aesEncrypt } from "./encrypt"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// ─── 토큰 관리 ───
export interface TokenPair {
  accessToken: string
  secret: string
}

// 인증 에러 코드 — 토큰 재발급 후 재시도
const TOKEN_ERROR_CODES = new Set([
  "40000001", // 잘못된 서버 타입
  "40000003", // 잘못된 토큰 (필드 부족/잘못된 인증 타입)
  "40000004", // 만료된 토큰
])

// 로그아웃 콜백 — auth store에서 등록
let onAuthError: (() => void) | null = null

/** 인증 에러 시 로그아웃 콜백 등록 */
export function setAuthErrorHandler(handler: () => void) {
  onAuthError = handler
}

let cachedToken: TokenPair | null = null
let isUserToken = false // true: 로그인 토큰, false: 임시 토큰
let tokenPromise: Promise<TokenPair> | null = null
// 토큰 재발급 중 다른 요청이 재시도하지 않도록 직렬화
let refreshPromise: Promise<TokenPair> | null = null

async function getToken(): Promise<TokenPair> {
  // 재발급 진행 중이면 그 결과를 기다림
  if (refreshPromise) return refreshPromise
  if (cachedToken) return cachedToken
  if (tokenPromise) return tokenPromise

  tokenPromise = fetchToken()
  try {
    return await tokenPromise
  } finally {
    tokenPromise = null
  }
}

async function fetchToken(): Promise<TokenPair> {
  const authUrl = `${BASE_URL}/auth/sessions/temporary`
  const res = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()
  const token = data.result?.token
  if (token?.access_token && token?.secret) {
    cachedToken = { accessToken: token.access_token, secret: token.secret }
    return cachedToken
  }
  throw new Error("토큰 발급 실패")
}

function clearToken() {
  cachedToken = null
}

/** 로그인 성공 시 호출 — 로그인 토큰으로 교체 */
export function setClientToken(token: TokenPair) {
  cachedToken = token
  isUserToken = true
}

/** 로그아웃 시 호출 — 토큰 초기화 (다음 요청에서 임시 토큰 재발급) */
export function clearClientToken() {
  cachedToken = null
  isUserToken = false
}

// ─── API 클라이언트 ───
interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
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

interface ApiResponse<T> {
  code: string
  desc: string
  result: T
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers: customHeaders, ...rest } = options
  const token = await getToken()
  const secretCode = await generateSecretCode(token.accessToken, token.secret)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "app-token": token.accessToken,
    "app-secret-code": secretCode,
    ...customHeaders as Record<string, string>,
  }

  const url = buildUrl(path, params)
  const response = await fetch(url, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  // 토큰 에러 처리
  // 로그인 토큰으로 요청했는데 실패 → 로그아웃 + 임시 토큰으로 재시도
  // 임시 토큰으로 요청했는데 실패 → 더 할 수 있는 게 없으므로 throw
  const isTokenError = TOKEN_ERROR_CODES.has(data.code)
  if (isTokenError && isUserToken) {
    // 이미 다른 요청이 재발급 중이면 그 결과를 기다림
    if (refreshPromise) {
      const refreshedToken = await refreshPromise
      const retrySecretCode = await generateSecretCode(refreshedToken.accessToken, refreshedToken.secret)
      headers["app-token"] = refreshedToken.accessToken
      headers["app-secret-code"] = retrySecretCode
    } else {
      // 첫 번째 에러 감지 → 로그아웃 + 임시 토큰 재발급
      clearToken()
      isUserToken = false
      onAuthError?.()
      refreshPromise = getToken()
      try {
        const newToken = await refreshPromise
        const newSecretCode = await generateSecretCode(newToken.accessToken, newToken.secret)
        headers["app-token"] = newToken.accessToken
        headers["app-secret-code"] = newSecretCode
      } finally {
        refreshPromise = null
      }
    }

    const retryResponse = await fetch(buildUrl(path, params), {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    const retryData: ApiResponse<T> = await retryResponse.json()
    if (retryData.code === "20000000") {
      return retryData.result
    }
    throw new Error(`API Error: ${retryData.code} ${retryData.desc}`)
  }

  if (data.code !== "20000000") {
    throw new Error(`API Error: ${data.code} ${data.desc}`)
  }

  return data.result
}

/** 현재 토큰의 secret을 반환 (비밀번호 암호화용) */
export async function getTokenSecret(): Promise<string> {
  const token = await getToken()
  return token.secret
}

/** 비밀번호를 AES 암호화 */
export async function encryptPassword(password: string): Promise<string> {
  const secret = await getTokenSecret()
  return aesEncrypt(password, secret)
}

export const api = {
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined> | object) {
    return request<T>(path, { method: "GET", params: params as Record<string, string | number | boolean | undefined> })
  },
  post<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined> | object) {
    return request<T>(path, { method: "POST", body, params: params as Record<string, string | number | boolean | undefined> })
  },
}
