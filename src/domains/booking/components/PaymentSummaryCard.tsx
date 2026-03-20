import { Coins } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { PaymentSummary } from "../types"

interface PaymentSummaryCardProps {
  summary: PaymentSummary
  benefitPointRate: number
  isValid: boolean
  onSubmit: () => void
}

export function PaymentSummaryCard({
  summary,
  benefitPointRate,
  isValid,
  onSubmit,
}: PaymentSummaryCardProps) {
  const earnedMileage = Math.floor(summary.totalAmount * (benefitPointRate / 100))

  return (
    <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-semibold text-lg">결제 정보</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">객실 요금</span>
          <span>{summary.roomPrice.toLocaleString()}원</span>
        </div>

        {summary.couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">쿠폰 할인</span>
            <span className="text-red-500">-{summary.couponDiscount.toLocaleString()}원</span>
          </div>
        )}

        {summary.mileageDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">마일리지 사용</span>
            <span className="text-red-500">-{summary.mileageDiscount.toLocaleString()}원</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-baseline">
        <span className="font-semibold">최종 결제금액</span>
        <span className="text-2xl font-bold">{summary.totalAmount.toLocaleString()}원</span>
      </div>

      {earnedMileage > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-primary">
          <Coins className="size-4" />
          <span>결제 시 <strong>{earnedMileage.toLocaleString()}P</strong> 적립 ({benefitPointRate}%)</span>
        </div>
      )}

      <Button
        size="lg"
        className="w-full text-base"
        disabled={!isValid}
        onClick={onSubmit}
      >
        결제하기
      </Button>
    </div>
  )
}
