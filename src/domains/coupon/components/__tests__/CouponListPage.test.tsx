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
  remain7dayCount: 0,
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
    total_amount: 6,
    remain_amount: 3,
    code: "TESTCODE001",
    title: "테스트 쿠폰",
    description: "테스트 쿠폰 설명",
    category_code: "STEP3",
    sub_category_code: "AUTO",
    type: "PACKAGE",
    discount_type: "AMOUNT",
    dup_use_yn: "N",
    usable_yn: "Y",
    status: "C001",
    dimmed_yn: "N",
    start_dt: 1772809200,
    end_dt: 1775487599,
    usable_start_dt: 1772809200,
    usable_end_dt: 1775487599,
    enterable_start_dt: 1772809200,
    enterable_end_dt: 1775487599,
    reg_dt: 1772859600,
    day_codes: [],
    constraints: [],
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockHookReturn.coupons = []
  mockHookReturn.totalCount = 0
  mockHookReturn.remain7dayCount = 0
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

    it("AMOUNT 타입 쿠폰은 원 단위로 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({
          coupon_pk: 1,
          discount_type: "AMOUNT",
          discount_amount: 5000,
        }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("5,000원")).toBeTruthy()
    })

    it("초 단위 타임스탬프를 YYYY.MM.DD 형식으로 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({
          coupon_pk: 1,
          usable_start_dt: 1772809200,
          usable_end_dt: 1775487599,
        }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      // 1772809200 -> 2026.03.08 (KST), 1775487599 -> 2026.04.07 (KST)
      const dateTexts = screen.getByText(/2026\./)
      expect(dateTexts).toBeTruthy()
    })
  })

  describe("7일 내 만료 배지", () => {
    it("remain7dayCount > 0 이면 만료 임박 배지를 표시한다", async () => {
      mockHookReturn.remain7dayCount = 3
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1 }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByTestId("expire-soon-badge")).toBeTruthy()
      expect(screen.getByText(/7일 내 만료 3장/)).toBeTruthy()
    })

    it("remain7dayCount === 0 이면 배지를 표시하지 않는다", async () => {
      mockHookReturn.remain7dayCount = 0
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1 }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.queryByTestId("expire-soon-badge")).toBeNull()
    })
  })

  describe("제약 조건 표시", () => {
    it("constraints에서 CC004, CC007을 필터링하고 description을 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({
          coupon_pk: 1,
          constraints: [
            { code: "CC004", value: "D_KCST_001", description: "적용제휴점" },
            { code: "CC002", value: "010102", description: "숙박" },
            { code: "CC005", value: "ALL", description: "주말/평일" },
            { code: "CC007", value: "N", description: "재발급여부" },
            { code: "CC001", value: "0", description: "최소 객실 금액(판매가) 이상" },
          ],
        }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      // 카드를 클릭하여 확장
      const card = screen.getByText("테스트 쿠폰")
      fireEvent.click(card)

      // 보여야 하는 것
      expect(screen.getByText("숙박")).toBeTruthy()
      expect(screen.getByText("주말/평일")).toBeTruthy()
      expect(screen.getByText("최소 객실 금액(판매가) 이상")).toBeTruthy()

      // 숨겨야 하는 것
      expect(screen.queryByText("적용제휴점")).toBeNull()
      expect(screen.queryByText("재발급여부")).toBeNull()
    })
  })

  describe("중복사용 배지", () => {
    it("dup_use_yn이 Y이면 중복사용 배지를 표시한다", async () => {
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1, dup_use_yn: "Y", dimmed_yn: "N" }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.getByText("중복사용")).toBeTruthy()
    })

    it("dup_use_yn이 N이면 중복사용 배지를 표시하지 않는다", async () => {
      mockHookReturn.coupons = [
        createCoupon({ coupon_pk: 1, dup_use_yn: "N", dimmed_yn: "N" }),
      ]

      const { CouponListPage } = await import("../CouponListPage")
      render(<CouponListPage />)

      expect(screen.queryByText("중복사용")).toBeNull()
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
