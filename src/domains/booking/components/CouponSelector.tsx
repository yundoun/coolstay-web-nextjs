import { Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Coupon } from "../types"

interface CouponSelectorProps {
  coupons: Coupon[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  roomPrice: number
}

export function CouponSelector({ coupons, selectedId, onSelect, roomPrice }: CouponSelectorProps) {
  if (coupons.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">사용 가능한 쿠폰이 없습니다.</div>
    )
  }

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === "fixed") {
      return `-${coupon.discountValue.toLocaleString()}원`
    }
    const amount = Math.floor(roomPrice * (coupon.discountValue / 100))
    return `-${amount.toLocaleString()}원 (${coupon.discountValue}%)`
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">쿠폰</label>
      <div className="space-y-2">
        {/* 미적용 */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg border text-sm text-left transition-colors",
            selectedId === null
              ? "border-primary bg-primary/5"
              : "border-border hover:border-border"
          )}
        >
          <Ticket className="size-4 text-muted-foreground shrink-0" />
          <span className="flex-1">쿠폰 미적용</span>
        </button>

        {coupons.map((coupon) => (
          <button
            key={coupon.id}
            onClick={() => onSelect(coupon.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border text-sm text-left transition-colors",
              selectedId === coupon.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-border"
            )}
          >
            <Ticket className="size-4 text-primary shrink-0" />
            <span className="flex-1">{coupon.name}</span>
            <span className="font-semibold text-red-500 shrink-0">
              {getDiscountText(coupon)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
