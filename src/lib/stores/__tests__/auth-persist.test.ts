// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"

// client.ts 모킹
vi.mock("@/lib/api/client", () => ({
  setClientToken: vi.fn(),
  clearClientToken: vi.fn(),
  api: { get: vi.fn(), post: vi.fn() },
}))

// localStorage 모킹 (jsdom v29 호환)
const storage = new Map<string, string>()
const localStorageMock: Storage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
  get length() { return storage.size },
  key: (index: number) => [...storage.keys()][index] ?? null,
}
vi.stubGlobal("localStorage", localStorageMock)

import { setClientToken } from "@/lib/api/client"

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
  storage.clear()
  vi.resetModules()
})

async function loadAuthStore() {
  const mod = await import("../auth")
  return mod
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. localStorage 영속화
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("localStorage 영속화", () => {
  it("setSession 후 localStorage에 상태가 저장된다", async () => {
    const { useAuthStore } = await loadAuthStore()
    useAuthStore.getState().setSession(mockToken, mockUser)

    const saved = localStorage.getItem("auth-storage")
    expect(saved).toBeTruthy()
  })

  it("저장된 데이터에 token과 user가 포함된다", async () => {
    const { useAuthStore } = await loadAuthStore()
    useAuthStore.getState().setSession(mockToken, mockUser)

    const saved = localStorage.getItem("auth-storage")
    const parsed = JSON.parse(saved!)
    expect(parsed.state.token).toEqual(mockToken)
    expect(parsed.state.user).toEqual(mockUser)
    expect(parsed.state.isLoggedIn).toBe(true)
  })

  it("clearSession 후 localStorage에서 로그아웃 상태가 저장된다", async () => {
    const { useAuthStore } = await loadAuthStore()
    useAuthStore.getState().setSession(mockToken, mockUser)
    useAuthStore.getState().clearSession()

    const saved = localStorage.getItem("auth-storage")
    const parsed = JSON.parse(saved!)
    expect(parsed.state.token).toBeNull()
    expect(parsed.state.user).toBeNull()
    expect(parsed.state.isLoggedIn).toBe(false)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. hydration — localStorage에서 상태 복원
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function waitForHydration(store: { persist: { onFinishHydration: (fn: () => void) => () => void; hasHydrated: () => boolean } }) {
  await new Promise<void>((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve()
      return
    }
    const unsub = store.persist.onFinishHydration(() => {
      unsub()
      resolve()
    })
  })
}

describe("hydration 복원", () => {
  it("localStorage에 저장된 세션이 있으면 상태를 복원한다", async () => {
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        state: { token: mockToken, user: mockUser, isLoggedIn: true },
        version: 0,
      })
    )

    const { useAuthStore } = await loadAuthStore()
    await waitForHydration(useAuthStore)

    const state = useAuthStore.getState()
    expect(state.token).toEqual(mockToken)
    expect(state.user).toEqual(mockUser)
    expect(state.isLoggedIn).toBe(true)
  })

  it("hydration 완료 후 client 토큰을 복원한다", async () => {
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        state: { token: mockToken, user: mockUser, isLoggedIn: true },
        version: 0,
      })
    )

    const { useAuthStore } = await loadAuthStore()
    await waitForHydration(useAuthStore)

    expect(setClientToken).toHaveBeenCalledWith({
      accessToken: "login-token",
      secret: "login-secret",
    })
  })

  it("localStorage에 세션이 없으면 비로그인 상태를 유지한다", async () => {
    const { useAuthStore } = await loadAuthStore()
    await waitForHydration(useAuthStore)

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isLoggedIn).toBe(false)
    expect(setClientToken).not.toHaveBeenCalled()
  })
})
