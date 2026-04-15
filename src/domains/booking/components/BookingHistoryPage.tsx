"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Moon, Calendar, Search } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBookingList } from "../hooks/useBookingList"
import type { BookingHistoryItem, BookingStatus } from "../types"

type TabFilter = "all" | "upcoming" | "used" | "cancelled"

const TABS: { key: TabFilter; label: string; reserveType: "ALL" | "BEFORE" | "AFTER" | "CANCEL" }[] = [
  { key: "all", label: "전체", reserveType: "ALL" },
  { key: "upcoming", label: "예약", reserveType: "BEFORE" },
  { key: "used", label: "이용완료", reserveType: "AFTER" },
  { key: "cancelled", label: "취소", reserveType: "CANCEL" },
]

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  confirmed: { label: "예약완료", variant: "default" },
  checked_in: { label: "이용완료", variant: "secondary" },
  cancelled: { label: "예약취소", variant: "destructive" },
  processing: { label: "처리중", variant: "outline" },
}

const PAYMENT_LABELS: Record<string, string> = {
  onsite: "현장결제",
  card: "카드결제",
  transfer: "계좌이체",
  phone: "휴대폰결제",
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
}

function diffDays(a: string, b: string) {
  const da = new Date(a + "T00:00:00")
  const db = new Date(b + "T00:00:00")
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24))
}

export function BookingHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all")
  const currentTab = TABS.find((t) => t.key === activeTab)!
  const { items, totalCount, isLoading, error, hasMore, loadMore } = useBookingList(currentTab.reserveType)

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">예약 내역</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && !isLoading && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {totalCount}
              </span>
            )}
          </TabButton>
        ))}
      </div>

      {/* Error */}
      {error && <ErrorState message={error} />}

      {/* Loading */}
      {isLoading && items.length === 0 ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Search}
          title="예약 내역이 없습니다"
          description="꿀스테이에서 특별한 숙소를 찾아보세요"
          action={{ label: "숙소 둘러보기", href: "/search" }}
        />
      ) : (
        <div className="space-y-4">
          {items.map((booking) => (
            <BookingCard key={booking.bookingId} booking={booking} />
          ))}
          {hasMore && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                {isLoading ? "불러오는 중..." : "더보기"}
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function BookingCard({ booking }: { booking: BookingHistoryItem }) {
  const status = STATUS_CONFIG[booking.status]
  const isRental = booking.bookingType === "rental"
  const nights = isRental ? 0 : diffDays(booking.checkIn, booking.checkOut)

  const dateDisplay = isRental
    ? `${formatDateKr(booking.checkIn)} / 대실 ${booking.usageTime || ""}`
    : `${formatDateKr(booking.checkIn)} ~ ${formatDateKr(booking.checkOut)} / ${nights}박 ${nights + 1}일`

  return (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/bookings/${booking.bookingId}`} className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0">
          {booking.roomImageUrl ? (
            <Image
              src={booking.roomImageUrl}
              alt={booking.roomName}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute bottom-0 left-0 right-0">
            <Badge
              variant={status.variant}
              className="w-full rounded-none rounded-b-lg justify-center text-xs py-1"
            >
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{booking.accommodationName}</h3>
              <p className="text-sm text-muted-foreground truncate">{booking.roomName}</p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              {isRental ? (
                <><Clock className="size-3 mr-1" />대실</>
              ) : (
                <><Moon className="size-3 mr-1" />숙박</>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Calendar className="size-3.5 shrink-0" />
            <span>{dateDisplay}</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">
              {booking.totalAmount.toLocaleString()}원
            </span>
            <span className="text-xs text-muted-foreground">
              {PAYMENT_LABELS[booking.paymentMethod]}
            </span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex border-t">
        <Link
          href={`/accommodations/${booking.accommodationId}`}
          className="flex-1 py-3 text-sm text-center text-muted-foreground hover:bg-muted/50 transition-colors font-medium"
        >
          숙소 보기
        </Link>
        {booking.status === "checked_in" && !booking.hasReview && (
          <>
            <div className="w-px bg-border" />
            <button className="flex-1 py-3 text-sm text-primary hover:bg-primary/5 transition-colors font-medium">
              후기 작성
            </button>
          </>
        )}
        {booking.status === "checked_in" && booking.hasReview && (
          <>
            <div className="w-px bg-border" />
            <button className="flex-1 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors font-medium">
              후기 확인
            </button>
          </>
        )}
      </div>
    </div>
  )
}

