"use client"

import { useState, useEffect, useCallback } from "react"
import { getCouponList, registerCoupon } from "../api/couponApi"
import type { Coupon } from "../types"

export function useCouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getCouponList({ search_type: "ST601" })
      setCoupons(Array.isArray(res.coupons) ? res.coupons : [])
      setTotalCount(res.total_count)
    } catch (err) {
      setError(err instanceof Error ? err.message : "쿠폰 목록을 불러올 수 없습니다")
      setCoupons([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const register = useCallback(async (couponCode: string, optionSeq?: number) => {
    const res = await registerCoupon({ coupon_code: couponCode, option_seq: optionSeq })
    await fetchList()
    return res
  }, [fetchList])

  return { coupons, totalCount, isLoading, error, register, refresh: fetchList }
}
