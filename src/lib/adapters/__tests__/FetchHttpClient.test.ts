import { describe, it, expect, vi, beforeEach } from "vitest"
import { FetchHttpClient } from "../FetchHttpClient"
import { ApiTokenManager } from "../ApiTokenManager"
import type { HttpClient } from "@/lib/ports/HttpClient"

// encrypt 모듈 모킹 — secretCode 생성을 단순화
vi.mock("@/lib/api/encrypt", () => ({
  generateSecretCode: vi.fn(async () => "mocked-secret-code"),
  aesEncrypt: vi.fn(async (text: string) => `encrypted-${text}`),
}))

describe("FetchHttpClient", () => {
  let client: HttpClient
  let tokenManager: ApiTokenManager
  let fetchMock: ReturnType<typeof vi.fn>

  function mockTokenResponse(accessToken = "test-token", secret = "test-secret") {
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
      json: async () => ({ code: "20000000", desc: "success", result }),
    }
  }

  function mockExpiredTokenResponse() {
    return {
      ok: true,
      json: async () => ({ code: "40000004", desc: "토큰 만료", result: null }),
    }
  }

  function mockErrorResponse(code = "50000000", desc = "서버 에러") {
    return {
      ok: true,
      json: async () => ({ code, desc, result: null }),
    }
  }

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    tokenManager = new ApiTokenManager()
    client = new FetchHttpClient(tokenManager)
  })

  describe("GET 요청", () => {
    it("경로와 헤더를 포함하여 요청한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockApiResponse({ items: [1, 2] }))

      const result = await client.get<{ items: number[] }>("/test/path")
      expect(result).toEqual({ items: [1, 2] })

      const [url, init] = fetchMock.mock.calls[1]
      expect(url).toContain("/test/path")
      expect(init.method).toBe("GET")
      const headers = init.headers as Record<string, string>
      expect(headers["app-token"]).toBe("test-token")
      expect(headers["app-secret-code"]).toBe("mocked-secret-code")
    })

    it("쿼리 파라미터를 URL에 추가한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockApiResponse({}))

      await client.get("/search", { keyword: "test", page: 1 })

      const [url] = fetchMock.mock.calls[1]
      expect(url).toContain("keyword=test")
      expect(url).toContain("page=1")
    })

    it("undefined 파라미터는 무시한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockApiResponse({}))

      await client.get("/search", { keyword: "test", filter: undefined })

      const [url] = fetchMock.mock.calls[1]
      expect(url).toContain("keyword=test")
      expect(url).not.toContain("filter")
    })
  })

  describe("POST 요청", () => {
    it("body를 JSON으로 전송한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockApiResponse({ id: 1 }))

      const result = await client.post<{ id: number }>("/create", { name: "test" })
      expect(result).toEqual({ id: 1 })

      const [, init] = fetchMock.mock.calls[1]
      expect(init.method).toBe("POST")
      expect(init.body).toBe(JSON.stringify({ name: "test" }))
    })

    it("body 없이도 요청할 수 있다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockApiResponse({}))

      await client.post("/action")

      const [, init] = fetchMock.mock.calls[1]
      expect(init.body).toBeUndefined()
    })
  })

  describe("에러 처리", () => {
    it("API 에러 코드 시 에러를 throw한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce(mockErrorResponse("50000000", "서버 에러"))

      await expect(client.get("/test")).rejects.toThrow("API Error: 50000000 서버 에러")
    })

    it("JSON 파싱 실패 시 에러를 throw한다", async () => {
      fetchMock
        .mockResolvedValueOnce(mockTokenResponse())
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: async () => { throw new Error("invalid json") },
        })

      await expect(client.get("/test")).rejects.toThrow("API Error: 500")
    })
  })

  describe("토큰 만료 재시도", () => {
    it("토큰 만료 시 재발급 후 재시도한다", async () => {
      tokenManager.setToken({ accessToken: "login-tk", secret: "login-sc" })

      fetchMock
        .mockResolvedValueOnce(mockExpiredTokenResponse()) // 1. 원래 요청 → 만료
        .mockResolvedValueOnce(mockTokenResponse("new-temp", "new-sc")) // 2. 임시 토큰 발급
        .mockResolvedValueOnce(mockApiResponse({ retried: true })) // 3. 재시도

      const result = await client.get("/test")
      expect(result).toEqual({ retried: true })
    })

    it("재시도도 실패하면 에러를 throw한다", async () => {
      tokenManager.setToken({ accessToken: "login-tk", secret: "login-sc" })

      fetchMock
        .mockResolvedValueOnce(mockExpiredTokenResponse())
        .mockResolvedValueOnce(mockTokenResponse("new", "new"))
        .mockResolvedValueOnce(mockErrorResponse("50000000", "서버 에러"))

      await expect(client.get("/test")).rejects.toThrow("API Error: 50000000 서버 에러")
    })
  })
})
