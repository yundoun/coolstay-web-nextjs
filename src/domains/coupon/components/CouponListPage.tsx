"use client"

import { useState } from "react"
import Link from "next/link"
import { Ticket, Tag, ChevronDown, ChevronUp, Gift } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { couponsMock } from "../data/mock"
import type { CouponItem } from "../types"

export function CouponListPage() {
  const [couponCode, setCouponCode] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const activeCoupons = couponsMock.filter((c) => !c.isUsed && !c.isExpired)
  const inactiveCoupons = couponsMock.filter((c) => c.isUsed || c.isExpired)

  const handleRegister = () => {
    if (!couponCode.trim()) return
    // Mock behavior
    alert("쿠폰이 등록되었습니다!")
    setCouponCode("")
  }

  return (
    <Container size="normal" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">쿠폰</h1>

      {/* Coupon Code Input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="쿠폰 코드 입력"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleRegister} disabled={!couponCode.trim()}>
          등록
        </Button>
      </div>

      {/* Coupon Count */}
      <div className="flex items-center gap-2 mb-4">
        <Ticket className="size-4 text-primary" />
        <span className="text-sm font-medium">
          사용 가능 쿠폰 <span className="text-primary">{activeCoupons.length}</span>장
        </span>
      </div>

      {/* Active Coupons */}
      {activeCoupons.length === 0 && inactiveCoupons.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {activeCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              expanded={expandedId === coupon.id}
              onToggle={() =>
                setExpandedId(expandedId === coupon.id ? null : coupon.id)
              }
            />
          ))}

          {/* Inactive Coupons */}
          {inactiveCoupons.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-sm text-muted-foreground font-medium">
                  사용완료/만료 쿠폰
                </p>
              </div>
              {inactiveCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  expanded={expandedId === coupon.id}
                  onToggle={() =>
                    setExpandedId(expandedId === coupon.id ? null : coupon.id)
                  }
                  disabled
                />
              ))}
            </>
          )}
        </div>
      )}
    </Container>
  )
}

function CouponCard({
  coupon,
  expanded,
  onToggle,
  disabled,
}: {
  coupon: CouponItem
  expanded: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  const discountDisplay =
    coupon.discountType === "percent"
      ? `${coupon.discountValue}%`
      : `${coupon.discountValue.toLocaleString()}원`

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-shadow",
        disabled ? "opacity-60" : "hover:shadow-md"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {coupon.isExpired && (
                <Badge variant="destructive" className="text-xs">만료</Badge>
              )}
              {coupon.isUsed && (
                <Badge variant="secondary" className="text-xs">사용완료</Badge>
              )}
              {!coupon.isExpired && !coupon.isUsed && (
                <Badge variant="default" className="text-xs">사용가능</Badge>
              )}
            </div>
            <p className="font-semibold mt-1">{coupon.title}</p>
            <p className="text-2xl font-bold text-primary mt-1">{discountDisplay}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {coupon.validFrom} ~ {coupon.validTo}
            </p>
          </div>
          <div className="shrink-0 pt-1">
            {expanded ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t px-4 py-3 space-y-2 bg-muted/30">
          <DetailRow icon={<Tag className="size-3.5" />} label="사용조건" value={coupon.usageCondition} />
          <DetailRow icon={<Ticket className="size-3.5" />} label="적용 숙소" value={coupon.applicableAccommodations} />
          <p className="text-xs text-muted-foreground pt-1">{coupon.description}</p>
        </div>
      )}
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="flex items-center gap-1 text-muted-foreground shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Gift className="size-10 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold">보유한 쿠폰이 없습니다</p>
      <p className="mt-1 text-sm text-muted-foreground">
        이벤트에서 다양한 쿠폰을 받아보세요
      </p>
      <Button className="mt-4" asChild>
        <Link href="/events">이벤트 보러가기</Link>
      </Button>
    </div>
  )
}
