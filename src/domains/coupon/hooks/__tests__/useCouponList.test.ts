// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"

const { mockGetCouponList, mockRegisterCoupon } = vi.hoisted(() => ({
  mockGetCouponList: vi.fn(),
  mockRegisterCoupon: vi.fn(),
}))
vi.mock("../../api/couponApi", () => ({
  getCouponList: mockGetCouponList,
  registerCoupon: mockRegisterCoupon,
}))

import { useCouponList } from "../useCouponList"

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useCouponList", () => {
  it("마운트 시 쿠폰 목록을 조회한다", async () => {
    mockGetCouponList.mockResolvedValueOnce({
      total_count: 2,
      remain7day_count: 1,
      next_cursor: "",
      coupons: [
        { coupon_pk: 1, title: "쿠폰1", status: "ACTIVE", dimmed_yn: "N" },
        { coupon_pk: 2, title: "쿠폰2", status: "EXPIRED", dimmed_yn: "Y" },
      ],
    })

    const { result } = renderHook(() => useCouponList(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetCouponList).toHaveBeenCalledWith({ search_type: "ST601" })
    expect(result.current.coupons).toHaveLength(2)
    expect(result.current.totalCount).toBe(2)
  })

  it("에러 발생 시 error를 반환한다", async () => {
    mockGetCouponList.mockRejectedValue(new Error("서버 에러"))

    const { result } = renderHook(() => useCouponList(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    }, { timeout: 5000 })

    expect(result.current.error).toBe("서버 에러")
    expect(result.current.coupons).toEqual([])
  })
})
