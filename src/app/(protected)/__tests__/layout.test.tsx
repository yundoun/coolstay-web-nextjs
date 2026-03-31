// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, act } from "@testing-library/react"

// next/navigation 모킹
const mockRedirect = vi.fn()
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args)
    throw new Error("NEXT_REDIRECT")
  },
  usePathname: () => "/mypage",
}))

// auth store 모킹 — hydration 상태 포함
let mockIsLoggedIn = false
let mockHasHydrated = true
let onFinishCallback: (() => void) | null = null

vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: Object.assign(
    (selector: (state: { isLoggedIn: boolean }) => unknown) =>
      selector({ isLoggedIn: mockIsLoggedIn }),
    {
      getState: () => ({ isLoggedIn: mockIsLoggedIn }),
      setState: vi.fn(),
      subscribe: vi.fn(),
      persist: {
        hasHydrated: () => mockHasHydrated,
        onFinishHydration: (fn: () => void) => {
          onFinishCallback = fn
          return () => { onFinishCallback = null }
        },
      },
    }
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockIsLoggedIn = false
  mockHasHydrated = true
  onFinishCallback = null
})

async function loadLayout() {
  const mod = await import("../layout")
  return mod.default
}

describe("(protected) layout", () => {
  it("비로그인 + hydration 완료 시 /login?redirect=현재경로 로 리다이렉트한다", async () => {
    mockIsLoggedIn = false
    mockHasHydrated = true

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
    mockIsLoggedIn = false
    mockHasHydrated = true

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
    mockIsLoggedIn = true
    mockHasHydrated = true

    const ProtectedLayout = await loadLayout()

    render(
      <ProtectedLayout>
        <div data-testid="protected-content">보호된 콘텐츠</div>
      </ProtectedLayout>
    )

    expect(screen.getByTestId("protected-content")).toBeTruthy()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("hydration 미완료 시 리다이렉트하지 않는다", async () => {
    mockIsLoggedIn = false
    mockHasHydrated = false

    const ProtectedLayout = await loadLayout()

    render(
      <ProtectedLayout>
        <div data-testid="protected-content">보호된 콘텐츠</div>
      </ProtectedLayout>
    )

    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("hydration 미완료 시 children 대신 로딩 상태를 표시한다", async () => {
    mockIsLoggedIn = false
    mockHasHydrated = false

    const ProtectedLayout = await loadLayout()

    render(
      <ProtectedLayout>
        <div data-testid="protected-content">보호된 콘텐츠</div>
      </ProtectedLayout>
    )

    expect(screen.queryByTestId("protected-content")).toBeNull()
  })
})
