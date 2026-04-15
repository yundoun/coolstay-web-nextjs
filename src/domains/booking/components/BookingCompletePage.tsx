"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Home, ClipboardList } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { BookingResult } from "../types"

const PAYMENT_LABELS: Record<string, string> = {
  onsite: "현장결제",
  card: "카드결제",
  transfer: "계좌이체",
  phone: "휴대폰결제",
}

export function BookingCompletePage() {
  const router = useRouter()
  const [result, setResult] = useState<BookingResult | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("bookingResult")
    if (data) {
      setResult(JSON.parse(data))
      sessionStorage.removeItem("bookingResult")
    } else {
      router.replace("/bookings")
    }
    setChecked(true)
  }, [router])

  if (!result || !checked) {
    return null
  }

  return (
    <Container size="narrow" padding="responsive" className="py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-50 mb-4">
          <CheckCircle className="size-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">예약이 완료되었습니다</h1>
        <p className="text-muted-foreground mt-1">
          예약번호 <strong className="text-foreground">{result.bookingId}</strong>
        </p>
      </div>

      {/* Booking Details */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-lg">예약 상세</h2>

        <div className="space-y-3 text-sm">
          <DetailRow label="숙소" value={result.accommodationName} />
          <DetailRow label="객실" value={result.roomName} />
          <DetailRow
            label="유형"
            value={result.bookingType === "rental" ? "대실" : "숙박"}
          />
          {result.usageTime && (
            <DetailRow label="이용시간" value={result.usageTime} />
          )}
          <DetailRow
            label={result.bookingType === "rental" ? "이용일" : "체크인"}
            value={result.checkIn}
          />
          {result.bookingType === "stay" && (
            <DetailRow label="체크아웃" value={result.checkOut} />
          )}

          <Separator />

          <DetailRow label="예약자" value={result.bookerName} />
          <DetailRow label="연락처" value={result.bookerPhone} />
          <DetailRow
            label="결제수단"
            value={PAYMENT_LABELS[result.paymentMethod] || result.paymentMethod}
          />

          <Separator />

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-semibold">결제금액</span>
            <span className="text-xl font-bold">
              {result.totalAmount.toLocaleString()}원
            </span>
          </div>
          {result.earnedMileage > 0 && (
            <div className="flex justify-between text-primary">
              <span>적립 마일리지</span>
              <span className="font-semibold">+{result.earnedMileage.toLocaleString()}P</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1 gap-2" asChild>
          <Link href="/bookings">
            <ClipboardList className="size-4" />
            예약 내역
          </Link>
        </Button>
        <Button className="flex-1 gap-2" asChild>
          <Link href="/">
            <Home className="size-4" />
            홈으로
          </Link>
        </Button>
      </div>
    </Container>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
