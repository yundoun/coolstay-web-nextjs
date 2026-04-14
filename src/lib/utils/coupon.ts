import type { Coupon } from "@/lib/api/types"

/** 쿠폰 1장의 실 할인금액 계산 */
export function calcCouponDiscount(coupon: Coupon, price: number): number {
  if (coupon.discount_type === "RATE") {
    let discount = Math.floor(price * (coupon.discount_amount / 100))
    const cc009 = coupon.constraints?.find(c => c.code === "CC009")
    if (cc009) {
      const limit = parseInt(cc009.value)
      if (limit > 0) discount = Math.min(discount, limit)
    }
    return discount
  }
  return coupon.discount_amount
}

/** 쿠폰 목록에서 최대 할인액, 적용가, 쿠폰 라벨 계산 */
export function calcBestCouponPrice(
  coupons: Coupon[] | undefined,
  price: number
): { bestDiscount: number; appliedPrice: number; label: string } | null {
  const usable = coupons?.filter(c => c.usable_yn === "Y" && c.dimmed_yn !== "Y")
  if (!usable || usable.length === 0) return null

  let bestCoupon = usable[0]
  let bestDiscount = calcCouponDiscount(bestCoupon, price)
  for (const c of usable) {
    const d = calcCouponDiscount(c, price)
    if (d > bestDiscount) {
      bestDiscount = d
      bestCoupon = c
    }
  }

  // 라벨: 쿠폰 title에서 핵심 키워드 추출 (무제한, 선착순 등), 없으면 "쿠폰"
  const title = bestCoupon.title || ""
  const label = title.match(/무제한|선착순|한정|특가/)?.[0] || "쿠폰"

  return { bestDiscount, appliedPrice: Math.max(0, price - bestDiscount), label }
}
