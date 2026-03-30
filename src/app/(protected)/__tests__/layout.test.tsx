// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

// next/navigation 모킹
const mockRedirect = vi.fn()
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args)
    // redirect는 throw하여 렌더링을 중단하는 동작을 시뮬레이션
    throw new Error("NEXT_REDIRECT")
  },
  usePathname: () => "/mypage",
}))

// auth store 모킹
const mockAuthStore = { isLoggedIn: false, token: null }
vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: Object.assign(
    (selector: (state: typeof mockAuthStore) => unknown) => selector(mockAuthStore),
    {
      getState: () => mockAuthStore,
      setState: vi.fn(),
      subscribe: vi.fn(),
      persist: { hasHydrated: () => true, onFinishHydration: vi.fn() },
    }
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockAuthStore.isLoggedIn = false
  mockAuthStore.token = null
})

async function loadLayout() {
  const mod = await import("../layout")
  return mod.default
}

describe("(protected) layout", () => {
  it("비로그인 시 /login?redirect=현재경로 로 리다이렉트한다", async () => {
    mockAuthStore.isLoggedIn = false

    const ProtectedLayout = await loadLayout()

    expect(() => {
      render(
        <ProtectedLayout>
          <div>보호된 콘텐츠</div>
        </ProtectedLayout>
      )
    }).toThrow("NEXT_REDIRECT")

    expect(mockRedirect).toHaveBeenCalledWith("/login?redirect=%2Fmypage")
  })

  it("비로그인 시 children을 렌더링하지 않는다", async () => {
    mockAuthStore.isLoggedIn = false

    const ProtectedLayout = await loadLayout()

    expect(() => {
      render(
        <ProtectedLayout>
          <div data-testid="protected-content">보호된 콘텐츠</div>
        </ProtectedLayout>
      )
    }).toThrow("NEXT_REDIRECT")

    expect(screen.queryByTestId("protected-content")).toBeNull()
  })

  it("로그인 시 children을 렌더링한다", async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.token = { access_token: "token", secret: "secret" } as typeof mockAuthStore.token

    const ProtectedLayout = await loadLayout()

    render(
      <ProtectedLayout>
        <div data-testid="protected-content">보호된 콘텐츠</div>
      </ProtectedLayout>
    )

    expect(screen.getByTestId("protected-content")).toBeTruthy()
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
