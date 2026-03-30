import { describe, it, expect, vi, beforeEach } from "vitest"

// client.ts의 setClientToken / clearClientToken을 모킹
vi.mock("@/lib/api/client", () => ({
  setClientToken: vi.fn(),
  clearClientToken: vi.fn(),
  api: { get: vi.fn(), post: vi.fn() },
}))

import { setClientToken, clearClientToken } from "@/lib/api/client"
import { useAuthStore } from "../auth"

const mockToken = { access_token: "login-token", secret: "login-secret" }
const mockUser = {
  key: 1,
  type: "U",
  id: "test@test.com",
  name: "테스트",
  nickname: "테스터",
  email: "test@test.com",
  phone_number: "01012345678",
  status: "S1",
  history_yn: "N",
}

beforeEach(() => {
  vi.clearAllMocks()
  useAuthStore.getState().clearSession()
})

describe("setSession", () => {
  it("user와 token을 저장하고 isLoggedIn을 true로 설정한다", () => {
    useAuthStore.getState().setSession(mockToken, mockUser)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toEqual(mockToken)
    expect(state.isLoggedIn).toBe(true)
  })

  it("setClientToken을 호출하여 client.ts 토큰을 교체한다", () => {
    useAuthStore.getState().setSession(mockToken, mockUser)

    expect(setClientToken).toHaveBeenCalledWith({
      accessToken: "login-token",
      secret: "login-secret",
    })
  })
})

describe("clearSession", () => {
  it("상태를 초기화하고 isLoggedIn을 false로 설정한다", () => {
    useAuthStore.getState().setSession(mockToken, mockUser)
    useAuthStore.getState().clearSession()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isLoggedIn).toBe(false)
  })

  it("clearClientToken을 호출하여 client.ts 토큰을 초기화한다", () => {
    useAuthStore.getState().setSession(mockToken, mockUser)
    useAuthStore.getState().clearSession()

    expect(clearClientToken).toHaveBeenCalled()
  })
})
