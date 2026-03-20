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

export function useBookingForm(context: BookingContext) {
  const [bookerInfo, setBookerInfo] = useState<BookerInfo>({ name: "", phone: "" })
  const [hasVehicle, setHasVehicle] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const [mileageUsed, setMileageUsed] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreements, setAgreements] = useState<AgreementItem[]>(DEFAULT_AGREEMENTS)

  // 쿠폰 할인 계산
  const couponDiscount = useMemo(() => {
    if (!selectedCouponId) return 0
    const coupon = context.availableCoupons.find((c) => c.id === selectedCouponId)
    if (!coupon) return 0
    if (coupon.discountType === "fixed") return coupon.discountValue
    return Math.floor(context.price * (coupon.discountValue / 100))
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
