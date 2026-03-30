// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// auth store 모킹
const mockAuthState = { isLoggedIn: false }
vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
}))

beforeEach(() => {
  mockAuthState.isLoggedIn = false
})

describe("BottomNav 로그인 상태 반영 (P1-17)", () => {
  it("비로그인 시 마이페이지 탭이 /login으로 이동한다", async () => {
    mockAuthState.isLoggedIn = false

    const { BottomNav } = await import("../BottomNav")
    render(<BottomNav />)

    const mypageLink = screen.getByText("마이페이지").closest("a")
    expect(mypageLink?.getAttribute("href")).toBe("/login")
  })

  it("로그인 시 마이페이지 탭이 /mypage로 이동한다", async () => {
    mockAuthState.isLoggedIn = true

    const { BottomNav } = await import("../BottomNav")
    render(<BottomNav />)

    const mypageLink = screen.getByText("마이페이지").closest("a")
    expect(mypageLink?.getAttribute("href")).toBe("/mypage")
  })
})
