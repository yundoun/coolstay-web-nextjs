// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

// next/navigation 모킹
const mockPush = vi.fn()
let mockSearchParams = new URLSearchParams()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// auth API 모킹
const mockLoginResult = {
  token: { access_token: "tok", secret: "sec" },
  user: { key: 1, type: "U", id: "t@t.com", name: "T", nickname: "T", email: "t@t.com", phone_number: "010", status: "S1", history_yn: "N" },
}
vi.mock("../../api/authApi", () => ({
  loginWithEmail: vi.fn().mockResolvedValue(mockLoginResult),
}))

// client 모킹
vi.mock("@/lib/api/client", () => ({
  encryptPassword: vi.fn().mockResolvedValue("encrypted"),
  setClientToken: vi.fn(),
  clearClientToken: vi.fn(),
}))

// auth store 모킹
const mockSetSession = vi.fn()
vi.mock("@/lib/stores/auth", () => ({
  useAuthStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({ setSession: mockSetSession }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockSearchParams = new URLSearchParams()
})

describe("로그인 후 redirect 복귀 (P1-20)", () => {
  it("redirect 파라미터가 없으면 홈으로 이동한다", async () => {
    const { LoginPage } = await import("../LoginPage")
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), { target: { value: "test@test.com" } })
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: "로그인" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  it("redirect 파라미터가 있으면 해당 경로로 이동한다", async () => {
    mockSearchParams = new URLSearchParams("redirect=/bookings")

    const { LoginPage } = await import("../LoginPage")
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), { target: { value: "test@test.com" } })
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: "로그인" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/bookings")
    })
  })

  it("redirect 파라미터가 외부 URL이면 무시하고 홈으로 이동한다", async () => {
    mockSearchParams = new URLSearchParams("redirect=https://evil.com")

    const { LoginPage } = await import("../LoginPage")
    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), { target: { value: "test@test.com" } })
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: "로그인" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })
})
