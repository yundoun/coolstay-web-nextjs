// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

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
          // 즉시 호출하여 테스트 진행
          if (mockHasHydrated) fn()
          return () => {}
        },
      },
    }
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockIsLoggedIn = false
  mockHasHydrated = true
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

    // hydration 전이므로 redirect 호출 없음
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

    // children이 렌더링되지 않음
    expect(screen.queryByTestId("protected-content")).toBeNull()
  })
})
