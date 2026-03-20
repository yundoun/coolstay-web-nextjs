const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
const INITIAL_APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN || ""
const APP_SECRET_CODE = process.env.NEXT_PUBLIC_APP_SECRET_CODE || ""

// ─── 토큰 관리 ───
let cachedToken: string | null = null
let tokenPromise: Promise<string> | null = null

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken
  // 동시 호출 시 하나의 요청만 실행
  if (tokenPromise) return tokenPromise

  tokenPromise = fetchToken()
  try {
    return await tokenPromise
  } finally {
    tokenPromise = null
  }
}

async function fetchToken(): Promise<string> {
  try {
    const authUrl = `${BASE_URL}/auth/sessions/temporary`
    const res = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app-token": INITIAL_APP_TOKEN,
        "app-secret-code": APP_SECRET_CODE,
      },
    })
    const data = await res.json()
    if (data.result?.token?.access_token) {
      cachedToken = data.result.token.access_token
      return cachedToken!
    }
  } catch {
    // 토큰 발급 실패 시 초기 토큰 사용
  }
  return INITIAL_APP_TOKEN
}

function clearToken() {
  cachedToken = null
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
      if (value !== undefined && value !== "") {
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "app-token": token,
    "app-secret-code": APP_SECRET_CODE,
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

  // 토큰 만료 시 재발급 후 재시도
  if (data.code === "40000004") {
    clearToken()
    const newToken = await getToken()
    headers["app-token"] = newToken

    const retryResponse = await fetch(buildUrl(path, params), {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    const retryData: ApiResponse<T> = await retryResponse.json()
    if (retryData.code !== "20000000") {
      throw new Error(`API Error: ${retryData.code} ${retryData.desc}`)
    }
    return retryData.result
  }

  if (data.code !== "20000000") {
    throw new Error(`API Error: ${data.code} ${data.desc}`)
  }

  return data.result
}

export const api = {
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
    return request<T>(path, { method: "GET", params })
  },
  post<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>) {
    return request<T>(path, { method: "POST", body, params })
  },
}
