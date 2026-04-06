import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import {
  getCouponList,
  registerCoupon,
  downloadCoupon,
  deleteCoupons,
} from "../couponApi"

beforeEach(() => {
  vi.clearAllMocks()
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 쿠폰 목록 조회
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("getCouponList", () => {
  it("GET /benefit/coupons/list에 search_type을 전달한다", async () => {
    const mockResponse = {
      total_count: 5,
      remain_7day_count: 2,
      next_cursor: "",
      coupons: [],
    }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getCouponList({ search_type: "ST601" })

    expect(mockGet).toHaveBeenCalledWith("/benefit/coupons/list", {
      search_type: "ST601",
    })
    expect(result.total_count).toBe(5)
  })

  it("정렬 및 페이지네이션 파라미터를 전달할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ total_count: 0, coupons: [] })

    await getCouponList({
      search_type: "ST601",
      sort_type: "EXPIRE",
      count: "20",
      cursor: "abc",
    })

    expect(mockGet).toHaveBeenCalledWith("/benefit/coupons/list", {
      search_type: "ST601",
      sort_type: "EXPIRE",
      count: "20",
      cursor: "abc",
    })
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 쿠폰 등록
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("registerCoupon", () => {
  it("POST /benefit/coupons/register에 쿠폰 코드를 전달한다", async () => {
    mockPost.mockResolvedValueOnce({})

    await registerCoupon({ coupon_code: "WELCOME2026" })

    expect(mockPost).toHaveBeenCalledWith("/benefit/coupons/register", {
      coupon_code: "WELCOME2026",
    })
  })

  it("선착순 쿠폰 시 coupon_options가 반환된다", async () => {
    const mockResponse = {
      coupon_options: [
        { option_seq: 1, discount_amount: 3000, option_title: "3천원", discount_type: "FIXED" },
        { option_seq: 2, discount_amount: 5000, option_title: "5천원", discount_type: "FIXED" },
      ],
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const result = await registerCoupon({ coupon_code: "FIRST100" })

    expect(result.coupon_options).toHaveLength(2)
  })

  it("option_seq를 포함하여 재요청할 수 있다", async () => {
    mockPost.mockResolvedValueOnce({})

    await registerCoupon({ coupon_code: "FIRST100", option_seq: 1 })

    expect(mockPost).toHaveBeenCalledWith("/benefit/coupons/register", {
      coupon_code: "FIRST100",
      option_seq: 1,
    })
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 쿠폰 다운로드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("downloadCoupon", () => {
  it("POST /benefit/coupons/download에 type과 key를 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await downloadCoupon({ type: "STORE_DOWNLOAD", key: "store-123" })

    expect(mockPost).toHaveBeenCalledWith("/benefit/coupons/download", {
      type: "STORE_DOWNLOAD",
      key: "store-123",
    })
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 쿠폰 삭제
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("deleteCoupons", () => {
  it("POST /benefit/coupons/delete에 쿠폰 키 배열을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteCoupons({ coupon_keys: [101, 102, 103] })

    expect(mockPost).toHaveBeenCalledWith("/benefit/coupons/delete", {
      coupon_keys: [101, 102, 103],
    })
  })
})
