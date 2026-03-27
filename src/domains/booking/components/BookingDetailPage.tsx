"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Clock,
  Moon,
  Calendar,
  User,
  Phone,
  CreditCard,
  Car,
  Copy,
  Share2,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useBookingDetail } from "../hooks/useBookingDetail"
import type { BookingStatus, PaymentMethod } from "../types"

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  confirmed: { label: "예약완료", variant: "default" },
  checked_in: { label: "이용완료", variant: "secondary" },
  cancelled: { label: "예약취소", variant: "destructive" },
  processing: { label: "처리중", variant: "outline" },
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  onsite: "현장결제",
  card: "카드결제",
  transfer: "계좌이체",
  phone: "휴대폰결제",
}

const TRANSPORT_LABELS: Record<string, string> = {
  자가용: "자가용",
  도보: "도보",
  대중교통: "대중교통",
}

function maskName(name: string) {
  if (name.length <= 1) return name
  return name[0] + "*".repeat(name.length - 1)
}

function maskPhone(phone: string) {
  const parts = phone.split("-")
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2].slice(0, 2)}**`
  }
  // 하이픈 없는 경우 (API 응답)
  if (phone.length >= 10) {
    return `${phone.slice(0, 3)}-****-${phone.slice(-4, -2)}**`
  }
  return phone
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}(${days[d.getDay()]})`
}

export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const { detail: booking, isLoading, error, cancel, hide } = useBookingDetail(bookingId)
  const [cancelLoading, setCancelLoading] = useState(false)

  if (isLoading) {
    return (
      <Container size="normal" padding="responsive" className="py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    )
  }

  if (error || !booking) {
    return (
      <Container size="normal" padding="responsive" className="py-20">
        <div className="text-center">
          <p className="text-lg font-semibold">
            {error || "예약 정보를 찾을 수 없습니다"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            올바른 예약 번호인지 확인해주세요
          </p>
          <Button className="mt-4" asChild>
            <Link href="/bookings">예약 내역으로</Link>
          </Button>
        </div>
      </Container>
    )
  }

  const status = STATUS_CONFIG[booking.status]
  const isRental = booking.bookingType === "rental"

  const handleCancel = async () => {
    if (!confirm("예약을 취소하시겠습니까?")) return
    setCancelLoading(true)
    const ok = await cancel()
    setCancelLoading(false)
    if (ok) {
      alert("예약이 취소되었습니다.")
    }
  }

  const handleDelete = async () => {
    if (!confirm("예약 내역을 삭제하시겠습니까?")) return
    const ok = await hide()
    if (ok) {
      router.push("/bookings")
    }
  }

  return (
    <Container size="normal" padding="responsive" className="py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-xl font-bold">예약 상세</h1>
      </div>

      {/* 숙소/객실 정보 */}
      <section className="rounded-xl border bg-card overflow-hidden">
        <div className="flex gap-4 p-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
            {booking.roomImageUrl ? (
              <Image
                src={booking.roomImageUrl}
                alt={booking.roomName}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{booking.accommodationName}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{booking.roomName}</p>
            <Badge variant="outline" className="mt-2 text-xs">
              {isRental ? (
                <><Clock className="size-3 mr-1" />대실</>
              ) : (
                <><Moon className="size-3 mr-1" />숙박</>
              )}
            </Badge>
          </div>
        </div>
        <div className="border-t px-4 py-3">
          <Link
            href={`/accommodations/${booking.accommodationId}`}
            className="text-sm text-primary font-medium hover:underline"
          >
            숙소 보기
          </Link>
        </div>
      </section>

      {/* 예약 정보 */}
      <section className="mt-4 rounded-xl border bg-card p-4">
        <h3 className="font-semibold mb-4">예약 정보</h3>
        <div className="space-y-3">
          <InfoRow label="예약 상태">
            <Badge variant={status.variant}>{status.label}</Badge>
          </InfoRow>
          <InfoRow label="예약 번호">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{booking.bookingId}</span>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigator.clipboard?.writeText(booking.bookingId)}
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </InfoRow>
          <InfoRow label="교통수단" icon={<Car className="size-3.5" />}>
            {TRANSPORT_LABELS[booking.transportation] || booking.transportation}
          </InfoRow>
          <Separator />
          <InfoRow label="체크인" icon={<Calendar className="size-3.5" />}>
            {formatDate(booking.checkIn)}
          </InfoRow>
          <InfoRow label="체크아웃" icon={<Calendar className="size-3.5" />}>
            {isRental
              ? `${formatDate(booking.checkOut)} / ${booking.usageTime}`
              : formatDate(booking.checkOut)}
          </InfoRow>
          <Separator />
          <InfoRow label="예약자" icon={<User className="size-3.5" />}>
            {maskName(booking.bookerName)}
          </InfoRow>
          <InfoRow label="연락처" icon={<Phone className="size-3.5" />}>
            {maskPhone(booking.bookerPhone)}
          </InfoRow>
          <InfoRow label="예약일시">
            {booking.bookingDate}
          </InfoRow>
        </div>
      </section>

      {/* 결제 정보 */}
      <section className="mt-4 rounded-xl border bg-card p-4">
        <h3 className="font-semibold mb-4">결제 정보</h3>
        <div className="space-y-3">
          <InfoRow label="결제수단" icon={<CreditCard className="size-3.5" />}>
            {PAYMENT_LABELS[booking.paymentMethod]}
          </InfoRow>
          <Separator />
          <PriceRow label="판매가" amount={booking.originalPrice} />
          {booking.couponDiscounts.map((c, i) => (
            <PriceRow
              key={i}
              label={c.name || `쿠폰${i + 1} 할인`}
              amount={-c.amount}
              highlight
            />
          ))}
          {booking.mileageDiscount > 0 && (
            <PriceRow
              label="마일리지 할인"
              amount={-booking.mileageDiscount}
              highlight
            />
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold">총 결제금액</span>
            <span className="text-lg font-bold text-primary">
              {booking.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </section>

      {/* 액션 버튼 */}
      <section className="mt-6 space-y-3">
        {booking.status === "confirmed" && booking.refundYn === "Y" && (
          <Button
            variant="destructive"
            className="w-full"
            size="lg"
            onClick={handleCancel}
            disabled={cancelLoading}
          >
            {cancelLoading ? "취소 처리중..." : "예약 취소"}
          </Button>
        )}
        {booking.status === "checked_in" && !booking.hasReview && (
          <Button className="w-full" size="lg">
            리뷰 작성
          </Button>
        )}
        {booking.status === "checked_in" && booking.hasReview && (
          <Button variant="outline" className="w-full" size="lg">
            리뷰 보기
          </Button>
        )}
        {booking.status === "checked_in" && (
          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link href={`/accommodations/${booking.accommodationId}`}>
              재예약
            </Link>
          </Button>
        )}

        {/* 공통 액션 */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" size="lg">
            <Share2 className="size-4 mr-2" />
            공유
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-500 hover:text-red-600"
            size="lg"
            onClick={handleDelete}
          >
            <Trash2 className="size-4 mr-2" />
            삭제
          </Button>
        </div>
      </section>
    </Container>
  )
}

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span>{children}</span>
    </div>
  )
}

function PriceRow({
  label,
  amount,
  highlight,
}: {
  label: string
  amount: number
  highlight?: boolean
}) {
  const isNegative = amount < 0
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-red-500" : ""}>
        {isNegative ? "-" : ""}
        {Math.abs(amount).toLocaleString()}원
      </span>
    </div>
  )
}
