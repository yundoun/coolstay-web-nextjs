// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

// next 모킹
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

// 검색바 모킹
vi.mock("@/domains/search/components/CompactSearchBar", () => ({
  CompactSearchBar: () => <div data-testid="search-bar" />,
}))

// auth store 모킹
const mockAuthState = { isLoggedIn: false, user: null as { nickname: string } | null }
vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
}))

beforeEach(() => {
  mockAuthState.isLoggedIn = false
  mockAuthState.user = null
})

describe("Header 로그인 상태 반영 (P1-16)", () => {
  it("비로그인 시 '로그인' 버튼을 표시한다", async () => {
    const { Header } = await import("../../Header/Header")
    render(<Header />)

    expect(screen.getByText("로그인")).toBeTruthy()
  })

  it("비로그인 시 로그인 버튼이 /login으로 링크된다", async () => {
    const { Header } = await import("../../Header/Header")
    render(<Header />)

    const loginLink = screen.getByText("로그인").closest("a")
    expect(loginLink?.getAttribute("href")).toBe("/login")
  })

  it("로그인 시 닉네임을 표시한다", async () => {
    mockAuthState.isLoggedIn = true
    mockAuthState.user = { nickname: "테스터" }

    const { Header } = await import("../../Header/Header")
    render(<Header />)

    expect(screen.getByText("테스터")).toBeTruthy()
    expect(screen.queryByText("로그인")).toBeNull()
  })

  it("로그인 시 마이페이지 링크를 표시한다", async () => {
    mockAuthState.isLoggedIn = true
    mockAuthState.user = { nickname: "테스터" }

    const { Header } = await import("../../Header/Header")
    render(<Header />)

    const userLink = screen.getByText("테스터").closest("a")
    expect(userLink?.getAttribute("href")).toBe("/mypage")
  })
})
