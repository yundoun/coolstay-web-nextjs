export type CouponDiscountType = "fixed" | "percent"

export interface CouponItem {
  id: string
  title: string
  discountType: CouponDiscountType
  discountValue: number
  minOrderAmount: number
  validFrom: string
  validTo: string
  usageCondition: string
  applicableAccommodations: string
  description: string
  isUsed: boolean
  isExpired: boolean
}
