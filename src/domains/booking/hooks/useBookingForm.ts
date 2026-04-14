"use client"

import { useState, useMemo, useCallback } from "react"
import type {
  BookerInfo,
  PaymentMethod,
  AgreementItem,
  BookingContext,
  PaymentSummary,
} from "../types"

const DEFAULT_AGREEMENTS: AgreementItem[] = [
  { id: "terms", label: "이용약관 동의", required: true, checked: false },
  { id: "privacy", label: "개인정보 수집 및 이용 동의", required: true, checked: false },
  { id: "thirdparty", label: "개인정보 제3자 제공 동의", required: true, checked: false },
  { id: "marketing", label: "마케팅 정보 수신 동의", required: false, checked: false },
]

/** 할인금액이 가장 큰 쿠폰의 ID 반환 */
function findBestCouponId(context: BookingContext): string | null {
  const { availableCoupons, rawCoupons, price, originalPrice } = context
  if (availableCoupons.length === 0) return null

  let bestId: string | null = null
  let bestDiscount = 0

  for (const coupon of availableCoupons) {
    let discount: number
    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue
    } else {
      const oneDayPrice = originalPrice ?? price
      discount = Math.floor(oneDayPrice * (coupon.discountValue / 100))
      const raw = rawCoupons?.find(c => String(c.coupon_pk) === coupon.id)
      const cc009 = raw?.constraints?.find(c => c.code === "CC009")
      if (cc009) {
        const limit = parseInt(cc009.value)
        if (limit > 0) discount = Math.min(discount, limit)
      }
    }
    if (discount > bestDiscount) {
      bestDiscount = discount
      bestId = coupon.id
    }
  }
  return bestId
}

export function useBookingForm(context: BookingContext) {
  const [bookerInfo, setBookerInfo] = useState<BookerInfo>({ name: "", phone: "" })
  const [hasVehicle, setHasVehicle] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(() => findBestCouponId(context))
  const [mileageUsed, setMileageUsed] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("onsite")
  const [agreements, setAgreements] = useState<AgreementItem[]>(DEFAULT_AGREEMENTS)

  // 쿠폰 할인 계산 (스펙: pricing-formula.md 기준)
  const couponDiscount = useMemo(() => {
    if (!selectedCouponId) return 0
    const coupon = context.availableCoupons.find((c) => c.id === selectedCouponId)
    if (!coupon) return 0
    const rawCoupon = context.rawCoupons.find((c) => String(c.coupon_pk) === selectedCouponId)

    if (coupon.discountType === "fixed") return coupon.discountValue

    // 정률(RATE) 할인: 1일차 가격(oneDayPrice)에만 적용 (연박 시)
    const oneDayPrice = context.originalPrice ?? context.price
    let discount = Math.floor(oneDayPrice * (coupon.discountValue / 100))

    // CC009 제약조건: 할인 상한선
    if (rawCoupon?.constraints) {
      const cc009 = rawCoupon.constraints.find((c) => c.code === "CC009")
      if (cc009) {
        const limit = parseInt(cc009.value)
        if (limit > 0) discount = Math.min(discount, limit)
      }
    }

    return discount
  }, [selectedCouponId, context])

  // 결제 요약
  const paymentSummary: PaymentSummary = useMemo(() => {
    const totalAmount = Math.max(0, context.price - couponDiscount - mileageUsed)
    return {
      roomPrice: context.price,
      couponDiscount,
      mileageDiscount: mileageUsed,
      totalAmount,
    }
  }, [context.price, couponDiscount, mileageUsed])

  // 마일리지 설정 (검증 포함)
  const handleSetMileage = useCallback(
    (value: number) => {
      if (value === 0) {
        setMileageUsed(0)
        return
      }
      const maxUsable = Math.min(context.availableMileage, context.price - couponDiscount)
      const clamped = Math.min(value, maxUsable)
      const rounded = Math.floor(clamped / 1000) * 1000
      if (rounded >= 3000 || rounded === 0) {
        setMileageUsed(rounded)
      }
    },
    [context.availableMileage, context.price, couponDiscount]
  )

  // 전액 사용
  const useAllMileage = useCallback(() => {
    const maxUsable = Math.min(context.availableMileage, context.price - couponDiscount)
    const rounded = Math.floor(maxUsable / 1000) * 1000
    setMileageUsed(rounded >= 3000 ? rounded : 0)
  }, [context.availableMileage, context.price, couponDiscount])

  // 약관 토글
  const toggleAgreement = useCallback((id: string) => {
    setAgreements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    )
  }, [])

  const toggleAllAgreements = useCallback(() => {
    setAgreements((prev) => {
      const allChecked = prev.every((a) => a.checked)
      return prev.map((a) => ({ ...a, checked: !allChecked }))
    })
  }, [])

  // 유효성 검증
  const isValid = useMemo(() => {
    if (!bookerInfo.name.trim() || !bookerInfo.phone.trim()) return false
    const requiredAgreements = agreements.filter((a) => a.required)
    if (!requiredAgreements.every((a) => a.checked)) return false
    return true
  }, [bookerInfo, agreements])

  const allAgreed = agreements.every((a) => a.checked)

  return {
    bookerInfo,
    setBookerInfo,
    hasVehicle,
    setHasVehicle,
    selectedCouponId,
    setSelectedCouponId,
    mileageUsed,
    setMileage: handleSetMileage,
    useAllMileage,
    paymentMethod,
    setPaymentMethod,
    agreements,
    toggleAgreement,
    toggleAllAgreements,
    allAgreed,
    paymentSummary,
    isValid,
  }
}
