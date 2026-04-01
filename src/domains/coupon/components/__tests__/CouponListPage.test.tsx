// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

// next/link 모킹
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// useCouponList 모킹
const mockRegister = vi.fn()
const mockHookReturn = {
  coupons: [] as ReturnType<typeof createCoupon>[],
  totalCount: 0,
  isLoading: false,
  error: null as string | null,
  register: mockRegister,
}

vi.mock("../../hooks/useCouponList", () => ({
  useCouponList: () => mockHookReturn,
}))

function createCoupon(overrides: Record<string, unknown> = {}) {
  return {
    coupon_pk: 1,
    discount_amount: 5000,
    title: "테스트 쿠폰",
    discount_type: "FIXED",
    status: "ACTIVE",
    received: true,
    constraints: [],
    dimmed_yn: "N",
    description: "설명",
    usable_start_dt: "2026-01-01",
    usable_end_dt: "2026-12-31",
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockHookReturn.coupons = []
  mockHookReturn.totalCount = 0
  mockHookReturn.isLoading = false
  mockHookReturn.error = null
  mockRegister.mockReset()
})

describe("CouponListPage", () => {
  describe("로딩 상태", () => {
    it("로딩 중 스피너를 표시한다", async () => {
      mockHookReturn.isLoading = true

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByRole("status")).toBeTruthy()
    })
  })

  describe("빈 상태", () => {
    it("쿠폰이 없으면 빈 상태 메시지를 표시한다", async () => {
      mockHookReturn.coupons = []

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("보유한 쿠폰이 없습니다")).toBeTruthy()
      expect(
        screen.getByText("이벤트에서 다양한 쿠폰을 받아보세요")
      ).toBeTruthy()
    })
  })

  describe("쿠폰 목록 렌더링", () => {
    it("활성 쿠폰을 렌더링한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1, title: "활성 쿠폰 A", dimmed_yn: "N" }),
        createCoupon({ coupon_pk: 2, title: "활성 쿠폰 B", dimmed_yn: "N" }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("활성 쿠폰 A")).toBeTruthy()
      expect(screen.getByText("활성 쿠폰 B")).toBeTruthy()
    })

    it("비활성(만료) 쿠폰 섹션을 렌더링한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1, title: "사용 가능", dimmed_yn: "N" }),
        createCoupon({ coupon_pk: 2, title: "만료된 쿠폰", dimmed_yn: "Y" }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("사용 가능")).toBeTruthy()
      expect(screen.getByText("만료된 쿠폰")).toBeTruthy()
      expect(screen.getByText("사용완료/만료 쿠폰")).toBeTruthy()
    })

    it("RATE 타입 쿠폰은 % 단위로 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({
          coupon_pk: 1,
          discount_type: "RATE",
          discount_amount: 10,
        }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("10%")).toBeTruthy()
    })

    it("FIXED 타입 쿠폰은 원 단위로 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({
          coupon_pk: 1,
          discount_type: "FIXED",
          discount_amount: 5000,
        }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("5,000원")).toBeTruthy()
    })
  })

  describe("쿠폰 코드 등록", () => {
    it("코드 입력 후 등록 버튼을 클릭하면 register를 호출한다", async () => {
      mockRegister.mockResolvedValue({})
      mockHookReturn.coupons = []

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      const input = screen.getByPlaceholderText("쿠폰 코드 입력")
      const button = screen.getByRole("button", { name: "등록" })

      fireEvent.change(input, { target: { value: "TESTCODE123" } })
      fireEvent.click(button)

      expect(mockRegister).toHaveBeenCalledWith("TESTCODE123")
    })

    it("빈 코드로는 등록 버튼이 비활성화된다", async () => {
      mockHookReturn.coupons = []

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      const button = screen.getByRole("button", { name: "등록" })
      expect((button as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
