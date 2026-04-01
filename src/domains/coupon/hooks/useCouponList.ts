"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { getCouponList, registerCoupon } from "../api/couponApi"

export function useCouponList() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getCouponList({ search_type: "ST601" }),
    retry: 1,
  })

  const coupons = Array.isArray(data?.coupons) ? data.coupons : []
  const totalCount = data?.total_count ?? 0
  const remain7dayCount = data?.remain7day_count ?? 0

  const register = useCallback(async (couponCode: string, optionSeq?: number) => {
    const res = await registerCoupon({ coupon_code: couponCode, option_seq: optionSeq })
    await queryClient.invalidateQueries({ queryKey: ["coupons"] })
    return res
  }, [queryClient])

  return {
    coupons,
    totalCount,
    remain7dayCount,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "쿠폰 목록을 불러올 수 없습니다") : null,
    register,
  }
}
