import { describe, it, expect, vi, beforeEach } from "vitest"

// ─── 헬퍼: fetch mock 응답 생성 ───

function mockTemporaryTokenResponse(accessToken = "temp-token", secret = "temp-secret") {
  return {
    ok: true,
    json: async () => ({
      code: "20000000",
      desc: "success",
      result: { token: { access_token: accessToken, secret } },
    }),
  }
}

function mockApiResponse<T>(result: T) {
  return {
    ok: true,
    json: async () => ({
      code: "20000000",
      desc: "success",
      result,
    }),
  }
}

function mockExpiredTokenResponse() {
  return {
    ok: true,
    json: async () => ({
      code: "40000004",
      desc: "토큰 만료",
      result: null,
    }),
  }
}

function mockErrorResponse(code = "50000000", desc = "서버 에러") {
  return {
    ok: true,
    json: async () => ({ code, desc, result: null }),
  }
}

// ─── 테스트 ───

// 매 테스트마다 모듈을 새로 import하여 cachedToken 등 모듈 상태 격리
async function loadClient() {
  const mod = await import("../client")
  return mod
}

beforeEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
  vi.stubGlobal("fetch", vi.fn())
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 비로그인 상태 — 임시 토큰
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("비로그인 상태", () => {
  it("API 요청 시 임시 토큰을 자동 발급한다", async () => {
    const fetchMock = vi.mocked(fetch)

    // 1차: 임시 토큰 발급, 2차: 실제 API 응답
    fetchMock
      .mockResolvedValueOnce(mockTemporaryTokenResponse() as Response)
      .mockResolvedValueOnce(mockApiResponse({ data: "ok" }) as Response)

    const { api } = await loadClient()
    const result = await api.get("/test")

    expect(result).toEqual({ data: "ok" })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    // 첫 번째 호출: 임시 토큰 발급
    expect(fetchMock.mock.calls[0][0]).toContain("/auth/sessions/temporary")
  })

  it("캐시된 임시 토큰이 있으면 재발급하지 않는다", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock
      .mockResolvedValueOnce(mockTemporaryTokenResponse() as Response)
      .mockResolvedValueOnce(mockApiResponse({ first: true }) as Response)
      .mockResolvedValueOnce(mockApiResponse({ second: true }) as Response)

    const { api } = await loadClient()
    await api.get("/first")
    await api.get("/second")

    // 임시 토큰 발급 1회 + API 호출 2회 = 3회
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it("동시 요청 시 임시 토큰을 한 번만 발급한다", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock
      .mockResolvedValueOnce(mockTemporaryTokenResponse() as Response)
      .mockResolvedValueOnce(mockApiResponse({ a: 1 }) as Response)
      .mockResolvedValueOnce(mockApiResponse({ b: 2 }) as Response)

    const { api } = await loadClient()
    const [r1, r2] = await Promise.all([api.get("/a"), api.get("/b")])

    expect(r1).toEqual({ a: 1 })
    expect(r2).toEqual({ b: 2 })
    // 임시 토큰 1회 + API 2회 = 3회 (중복 발급 없음)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 로그인 상태 — setClientToken
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("로그인 상태 (setClientToken)", () => {
  it("setClientToken 후 API 요청이 로그인 토큰을 사용한다", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(mockApiResponse({ user: "me" }) as Response)

    const { api, setClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })

    await api.get("/mypage")

    // 임시 토큰 발급 없이 바로 API 호출 = 1회
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [, requestInit] = fetchMock.mock.calls[0]
    const headers = requestInit?.headers as Record<string, string>
    expect(headers["app-token"]).toBe("login-token")
  })

  it("setClientToken 후 임시 토큰을 발급하지 않는다", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(mockApiResponse({}) as Response)

    const { api, setClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })

    await api.get("/test")

    // /auth/sessions/temporary 호출이 없어야 함
    const urls = fetchMock.mock.calls.map(([url]) => url)
    expect(urls.every((u) => !String(u).includes("/auth/sessions/temporary"))).toBe(true)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 로그아웃 — clearClientToken
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("로그아웃 (clearClientToken)", () => {
  it("clearClientToken 후 다음 요청에서 임시 토큰을 새로 발급한다", async () => {
    const fetchMock = vi.mocked(fetch)

    // 로그인 상태에서 API 호출
    fetchMock.mockResolvedValueOnce(mockApiResponse({}) as Response)

    const { api, setClientToken, clearClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })
    await api.get("/mypage")

    // 로그아웃
    clearClientToken()

    // 로그아웃 후 API 호출 → 임시 토큰 재발급
    fetchMock.mockResolvedValueOnce(mockTemporaryTokenResponse("new-temp", "new-secret") as Response)
    fetchMock.mockResolvedValueOnce(mockApiResponse({ guest: true }) as Response)

    await api.get("/home")

    // 마지막 호출에서 임시 토큰 발급이 일어났는지 확인
    const urls = fetchMock.mock.calls.map(([url]) => String(url))
    expect(urls.at(-2)).toContain("/auth/sessions/temporary")
  })

  it("clearClientToken 후 이전 로그인 토큰을 사용하지 않는다", async () => {
    const fetchMock = vi.mocked(fetch)

    const { api, setClientToken, clearClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })
    clearClientToken()

    fetchMock.mockResolvedValueOnce(mockTemporaryTokenResponse("temp-new", "secret-new") as Response)
    fetchMock.mockResolvedValueOnce(mockApiResponse({}) as Response)

    await api.get("/test")

    // API 호출의 app-token이 로그인 토큰이 아님
    const apiCall = fetchMock.mock.calls[1]
    const headers = (apiCall[1]?.headers) as Record<string, string>
    expect(headers["app-token"]).toBe("temp-new")
    expect(headers["app-token"]).not.toBe("login-token")
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 토큰 만료 재시도
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("토큰 만료 재시도", () => {
  it("임시 토큰 만료 시 재시도하지 않는다 (더 할 수 있는 게 없음)", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock
      // 1. 임시 토큰 발급
      .mockResolvedValueOnce(mockTemporaryTokenResponse("old-temp", "old-secret") as Response)
      // 2. API 호출 → 만료
      .mockResolvedValueOnce(mockExpiredTokenResponse() as Response)

    const { api } = await loadClient()

    await expect(api.get("/test")).rejects.toThrow("API Error: 40000004")
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("로그인 토큰 만료 시 로그아웃 + 임시 토큰으로 재시도한다", async () => {
    const fetchMock = vi.mocked(fetch)

    const { api, setClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })

    fetchMock
      // 1. API 호출 → 만료
      .mockResolvedValueOnce(mockExpiredTokenResponse() as Response)
      // 2. 임시 토큰 발급 (폴백)
      .mockResolvedValueOnce(mockTemporaryTokenResponse("fallback-temp", "fallback-secret") as Response)
      // 3. 재시도 → 성공
      .mockResolvedValueOnce(mockApiResponse({ fallback: true }) as Response)

    const result = await api.get("/test")

    expect(result).toEqual({ fallback: true })
    // 재시도에서 임시 토큰 사용 확인
    const retryCall = fetchMock.mock.calls[2]
    const headers = (retryCall[1]?.headers) as Record<string, string>
    expect(headers["app-token"]).toBe("fallback-temp")
  })

  it("로그인 토큰 재시도도 실패하면 에러를 throw한다", async () => {
    const fetchMock = vi.mocked(fetch)

    const { api, setClientToken } = await loadClient()
    setClientToken({ accessToken: "login-token", secret: "login-secret" })

    fetchMock
      // 1. API 호출 → 만료
      .mockResolvedValueOnce(mockExpiredTokenResponse() as Response)
      // 2. 임시 토큰 발급
      .mockResolvedValueOnce(mockTemporaryTokenResponse("new", "new") as Response)
      // 3. 재시도 → 서버 에러
      .mockResolvedValueOnce(mockErrorResponse("50000000", "서버 에러") as Response)

    await expect(api.get("/test")).rejects.toThrow("API Error: 50000000 서버 에러")
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. encryptPassword 토큰 소스
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("encryptPassword", () => {
  it("현재 활성 토큰의 secret을 사용하여 암호화한다", async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(mockTemporaryTokenResponse("t", "test-secret-key!") as Response)

    const { encryptPassword } = await loadClient()
    const encrypted = await encryptPassword("mypassword")

    // 암호화 결과가 빈 문자열이 아닌 Base64 문자열
    expect(encrypted).toBeTruthy()
    expect(typeof encrypted).toBe("string")
    // 원본 비밀번호와 다름
    expect(encrypted).not.toBe("mypassword")
  })
})
