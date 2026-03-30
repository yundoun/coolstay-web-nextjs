// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// next/navigation 모킹
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

// auth store 모킹
const mockClearSession = vi.fn()
const mockAuthState = {
  isLoggedIn: true,
  user: {
    nickname: "실제유저",
    email: "real@test.com",
    phone_number: "01099998888",
  },
  clearSession: mockClearSession,
}
vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockAuthState.user = {
    nickname: "실제유저",
    email: "real@test.com",
    phone_number: "01099998888",
  }
})

describe("MyPage auth store 연결 (P1-18)", () => {
  it("auth store의 실제 유저 닉네임을 표시한다", async () => {
    const { MyPage } = await import("../MyPage")
    render(<MyPage />)

    expect(screen.getByText("실제유저")).toBeTruthy()
  })

  it("auth store의 실제 유저 이메일을 표시한다", async () => {
    const { MyPage } = await import("../MyPage")
    render(<MyPage />)

    expect(screen.getByText("real@test.com")).toBeTruthy()
  })

  it("mockUser 데이터를 사용하지 않는다", async () => {
    const { MyPage } = await import("../MyPage")
    render(<MyPage />)

    expect(screen.queryByText("홍길동")).toBeNull()
    expect(screen.queryByText("hong@example.com")).toBeNull()
  })
})

describe("로그아웃 (P1-19)", () => {
  it("로그아웃 버튼 클릭 시 clearSession을 호출한다", async () => {
    const { MyPage } = await import("../MyPage")
    render(<MyPage />)

    const logoutButton = screen.getByText("로그아웃").closest("button")!
    fireEvent.click(logoutButton)

    expect(mockClearSession).toHaveBeenCalled()
  })

  it("로그아웃 후 홈으로 이동한다", async () => {
    const { MyPage } = await import("../MyPage")
    render(<MyPage />)

    const logoutButton = screen.getByText("로그아웃").closest("button")!
    fireEvent.click(logoutButton)

    expect(mockPush).toHaveBeenCalledWith("/")
  })
})
