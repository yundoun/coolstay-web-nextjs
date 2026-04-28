import { describe, it, expect, vi, beforeEach } from "vitest"
import { ApiTokenManager } from "../ApiTokenManager"
import type { TokenPair } from "@/lib/api/client"

describe("ApiTokenManager", () => {
  let manager: ApiTokenManager
  let fetchMock: ReturnType<typeof vi.fn>

  function mockTokenResponse(accessToken = "temp-token", secret = "temp-secret") {
    return {
      ok: true,
      json: async () => ({
        code: "20000000",
        desc: "success",
        result: { token: { access_token: accessToken, secret } },
      }),
    }
  }

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    manager = new ApiTokenManager()
  })

  describe("getToken", () => {
    it("캐시된 토큰이 없으면 임시 토큰을 발급한다", async () => {
      fetchMock.mockResolvedValueOnce(mockTokenResponse())
      const token = await manager.getToken()
      expect(token.accessToken).toBe("temp-token")
      expect(token.secret).toBe("temp-secret")
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("캐시된 토큰이 있으면 재발급하지 않는다", async () => {
      fetchMock.mockResolvedValueOnce(mockTokenResponse())
      await manager.getToken()
      await manager.getToken()
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("동시 호출 시 토큰을 한 번만 발급한다", async () => {
      fetchMock.mockResolvedValueOnce(mockTokenResponse())
      const [t1, t2] = await Promise.all([manager.getToken(), manager.getToken()])
      expect(t1.accessToken).toBe(t2.accessToken)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("토큰 발급 실패 시 에러를 throw한다", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: "20000000", result: { token: {} } }),
      })
      await expect(manager.getToken()).rejects.toThrow("토큰 발급 실패")
    })
  })

  describe("setToken / clearToken", () => {
    it("setToken 후 getToken이 설정된 토큰을 반환한다", async () => {
      const loginToken: TokenPair = { accessToken: "login-tk", secret: "login-sc" }
      manager.setToken(loginToken)
      const token = await manager.getToken()
      expect(token.accessToken).toBe("login-tk")
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("clearToken 후 getToken이 새 임시 토큰을 발급한다", async () => {
      manager.setToken({ accessToken: "login-tk", secret: "login-sc" })
      manager.clearToken()
      fetchMock.mockResolvedValueOnce(mockTokenResponse("new-temp", "new-secret"))
      const token = await manager.getToken()
      expect(token.accessToken).toBe("new-temp")
    })
  })

  describe("isAuthenticated", () => {
    it("초기 상태에서 false를 반환한다", () => {
      expect(manager.isAuthenticated()).toBe(false)
    })

    it("setToken 후 true를 반환한다", () => {
      manager.setToken({ accessToken: "tk", secret: "sc" })
      expect(manager.isAuthenticated()).toBe(true)
    })

    it("clearToken 후 false를 반환한다", () => {
      manager.setToken({ accessToken: "tk", secret: "sc" })
      manager.clearToken()
      expect(manager.isAuthenticated()).toBe(false)
    })
  })

  describe("onAuthError", () => {
    it("인증 에러 핸들러를 등록할 수 있다", () => {
      const handler = vi.fn()
      manager.onAuthError(handler)
      // 핸들러는 토큰 만료 시 호출됨 — handleTokenError에서 테스트
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe("handleTokenError", () => {
    it("로그인 토큰 에러 시 핸들러를 호출하고 토큰을 초기화한다", async () => {
      const handler = vi.fn()
      manager.onAuthError(handler)
      manager.setToken({ accessToken: "login-tk", secret: "sc" })

      fetchMock.mockResolvedValueOnce(mockTokenResponse("fallback", "fallback-sc"))
      const newToken = await manager.handleTokenError()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(newToken.accessToken).toBe("fallback")
      expect(manager.isAuthenticated()).toBe(false)
    })

    it("임시 토큰 에러 시 핸들러를 호출하지 않는다", async () => {
      const handler = vi.fn()
      manager.onAuthError(handler)
      // 로그인하지 않은 상태 (임시 토큰)

      fetchMock.mockResolvedValueOnce(mockTokenResponse("new-temp", "new-sc"))
      await manager.handleTokenError()

      expect(handler).not.toHaveBeenCalled()
    })

    it("동시 호출 시 한 번만 재발급한다", async () => {
      manager.setToken({ accessToken: "tk", secret: "sc" })
      fetchMock.mockResolvedValueOnce(mockTokenResponse("refreshed", "refreshed-sc"))

      const [t1, t2] = await Promise.all([
        manager.handleTokenError(),
        manager.handleTokenError(),
      ])

      expect(t1.accessToken).toBe(t2.accessToken)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })
})
