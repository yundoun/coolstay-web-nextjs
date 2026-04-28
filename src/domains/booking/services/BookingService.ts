import type { BookerInfo, BookingContext, Coupon, PaymentSummary } from "../types"
import type { Coupon as ApiCoupon } from "@/domains/coupon/types"

/**
 * 쿠폰 할인액 계산
 *
 * - 정액(fixed): discountValue 그대로 반환
 * - 정률(percent): oneDayPrice * rate, CC009 상한선 적용
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  oneDayPrice: number,
  rawCoupons: ApiCoupon[],
): number {
  if (coupon.discountType === "fixed") return coupon.discountValue

  let discount = Math.floor(oneDayPrice * (coupon.discountValue / 100))

  const rawCoupon = rawCoupons.find((c) => String(c.coupon_pk) === coupon.id)
  if (rawCoupon?.constraints) {
    const cc009 = rawCoupon.constraints.find((c) => c.code === "CC009")
    if (cc009) {
      const limit = parseInt(cc009.value)
      if (limit > 0) discount = Math.min(discount, limit)
    }
  }

  return discount
}

/** 결제 금액 계산 */
export function calculatePayment(
  roomPrice: number,
  couponDiscount: number,
  mileageDiscount: number,
): PaymentSummary {
  return {
    roomPrice,
    couponDiscount,
    mileageDiscount,
    totalAmount: Math.max(0, roomPrice - couponDiscount - mileageDiscount),
  }
}

/** 할인금액이 가장 큰 쿠폰의 ID 반환 */
export function findBestCouponId(context: BookingContext): string | null {
  const { availableCoupons, rawCoupons, price, originalPrice } = context
  if (availableCoupons.length === 0) return null

  let bestId: string | null = null
  let bestDiscount = 0
  const oneDayPrice = originalPrice ?? price

  for (const coupon of availableCoupons) {
    const discount = calculateCouponDiscount(coupon, oneDayPrice, rawCoupons)
    if (discount > bestDiscount) {
      bestDiscount = discount
      bestId = coupon.id
    }
  }
  return bestId
}

/** 예약자 정보 유효성 검증 */
export function validateBookerInfo(info: BookerInfo): boolean {
  return info.name.trim().length > 0 && info.phone.trim().length > 0
}
