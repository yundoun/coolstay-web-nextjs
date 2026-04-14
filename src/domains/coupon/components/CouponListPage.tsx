"use client"

import { useState } from "react"
import { Ticket, Clock, ChevronDown, ChevronUp, Gift, Info, CalendarDays, DoorOpen, Tag } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatTimestampDot } from "@/lib/utils/formatDate"
import { useCouponList } from "../hooks/useCouponList"
import type { Coupon, CouponConstraint } from "../types"

/** CC004(적용제휴점), CC007(재발급여부)는 사용자에게 불필요하므로 숨긴다 */
const HIDDEN_CONSTRAINT_CODES = new Set(["CC004", "CC007"])

function filterConstraints(constraints: CouponConstraint[]): CouponConstraint[] {
  return constraints.filter((c) => !HIDDEN_CONSTRAINT_CODES.has(c.code))
}

/** 할인 금액 크기별 왼쪽 accent 색상 */
function getAccentColor(coupon: Coupon): string {
  if (coupon.dimmed_yn === "Y") return "border-l-border"
  if (coupon.discount_type === "RATE") {
    if (coupon.discount_amount >= 20) return "border-l-rose-500"
    if (coupon.discount_amount >= 10) return "border-l-orange-500"
    return "border-l-amber-500"
  }
  // AMOUNT
  if (coupon.discount_amount >= 50000) return "border-l-rose-500"
  if (coupon.discount_amount >= 20000) return "border-l-orange-500"
  if (coupon.discount_amount >= 10000) return "border-l-blue-500"
  return "border-l-emerald-500"
}

function formatDiscount(coupon: Coupon): string {
  if (coupon.discount_type === "RATE") {
    return `${coupon.discount_amount}%`
  }
  return `${coupon.discount_amount.toLocaleString()}원`
}

/** day_codes → human-readable day names */
const DAY_CODE_NAMES: Record<string, string> = {
  MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일",
  "1": "월", "2": "화", "3": "수", "4": "목", "5": "금", "6": "토", "7": "일",
}

function formatDayCodes(codes: string[]): string {
  if (!codes || codes.length === 0) return ""
  const names = codes.map((c) => DAY_CODE_NAMES[c] || c)
  // Check if it's a weekday range (Mon-Fri)
  const weekdays = ["월", "화", "수", "목", "금"]
  const weekend = ["토", "일"]
  if (weekdays.every((d) => names.includes(d)) && !weekend.some((d) => names.includes(d))) {
    return "월~금"
  }
  if (weekend.every((d) => names.includes(d)) && !weekdays.some((d) => names.includes(d))) {
    return "토~일"
  }
  return names.join(", ")
}

/** coupon type + sub_category_code → badge label */
function getCouponTypeLabel(type: string, subCategory: string): string | null {
  const labels: Record<string, string> = {
    PACKAGE: "패키지",
    AUTO: "자동발급",
    DOWNLOAD: "다운로드",
    EVENT: "이벤트",
    MANUAL: "수동발급",
  }
  return labels[type] || labels[subCategory] || null
}

export function CouponListPage() {
  const { coupons, isLoading, error, register, remain7dayCount } = useCouponList()
  const [couponCode, setCouponCode] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const activeCoupons = coupons.filter((c) => c.dimmed_yn !== "Y")
  const inactiveCoupons = coupons.filter((c) => c.dimmed_yn === "Y")

  const handleRegister = async () => {
    if (!couponCode.trim()) return
    try {
      await register(couponCode)
      setCouponCode("")
    } catch {
      alert("쿠폰 등록에 실패했습니다")
    }
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRegister()
          }}
          className="flex-1"
        />
        <Button onClick={handleRegister} disabled={!couponCode.trim()}>
          등록
        </Button>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Ticket className="size-4 text-primary" />
          <span className="text-sm font-medium">
            사용 가능 쿠폰{" "}
            <span className="text-primary font-bold">{activeCoupons.length}</span>장
          </span>
        </div>
        {remain7dayCount > 0 && (
          <Badge
            variant="destructive"
            className="text-xs gap-1"
            data-testid="expire-soon-badge"
          >
            <Clock className="size-3" />
            7일 내 만료 {remain7dayCount}장
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} />
      ) : activeCoupons.length === 0 && inactiveCoupons.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="보유한 쿠폰이 없습니다"
          description="이벤트에서 다양한 쿠폰을 받아보세요"
          action={{ label: "이벤트 보러가기", href: "/events" }}
        />
      ) : (
        <div className="space-y-3">
          {activeCoupons.map((coupon) => (
            <CouponCard
              key={coupon.coupon_pk}
              coupon={coupon}
              expanded={expandedId === coupon.coupon_pk}
              onToggle={() =>
                setExpandedId(expandedId === coupon.coupon_pk ? null : coupon.coupon_pk)
              }
            />
          ))}

          {inactiveCoupons.length > 0 && (
            <>
              <div className="pt-6 pb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <p className="text-xs text-muted-foreground font-medium px-2">
                  사용완료/만료 쿠폰
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              {inactiveCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.coupon_pk}
                  coupon={coupon}
                  expanded={expandedId === coupon.coupon_pk}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === coupon.coupon_pk ? null : coupon.coupon_pk
                    )
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
  coupon: Coupon
  expanded: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  const isDimmed = coupon.dimmed_yn === "Y"
  const accentColor = getAccentColor(coupon)
  const visibleConstraints = filterConstraints(coupon.constraints ?? [])

  return (
    <div
      className={cn(
        "rounded-xl border border-l-4 bg-card overflow-hidden transition-all duration-200",
        accentColor,
        disabled ? "opacity-50 grayscale-[30%]" : "hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isDimmed ? (
                <Badge variant="secondary" className="text-xs">
                  만료
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs">
                  사용가능
                </Badge>
              )}
              {coupon.dup_use_yn === "Y" && !isDimmed && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  중복사용
                </Badge>
              )}
              {/* Type badge */}
              {(() => {
                const typeLabel = getCouponTypeLabel(coupon.type, coupon.sub_category_code)
                return typeLabel ? (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Tag className="size-3" />
                    {typeLabel}
                  </Badge>
                ) : null
              })()}
            </div>

            {/* Discount amount — hero text */}
            <p
              className={cn(
                "text-2xl font-extrabold tracking-tight",
                isDimmed ? "text-muted-foreground" : "text-primary"
              )}
            >
              {formatDiscount(coupon)}
              <span className="text-sm font-normal text-muted-foreground ml-1.5">할인</span>
            </p>

            {/* Title */}
            <p className="font-medium text-sm mt-1.5 text-foreground/90 truncate">
              {coupon.title}
            </p>

            {/* Validity period */}
            <p className="text-xs text-muted-foreground mt-2">
              {formatTimestampDot(coupon.usable_start_dt)} ~{" "}
              {formatTimestampDot(coupon.usable_end_dt)}
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

      {/* Expanded detail section */}
      {expanded && (
        <div className="border-t px-4 py-3 space-y-2.5 bg-muted/30">
          {/* Date info rows */}
          <div className="space-y-1.5">
            {/* Registration period */}
            {coupon.start_dt > 0 && coupon.end_dt > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5 shrink-0" />
                <span>등록기간: {formatTimestampDot(coupon.start_dt)} ~ {formatTimestampDot(coupon.end_dt)}</span>
              </div>
            )}

            {/* Usable period (separate from registration) */}
            {coupon.usable_start_dt > 0 && coupon.usable_end_dt > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                <span>사용기간: {formatTimestampDot(coupon.usable_start_dt)} ~ {formatTimestampDot(coupon.usable_end_dt)}</span>
              </div>
            )}

            {/* Enterable period */}
            {coupon.enterable_start_dt > 0 && coupon.enterable_end_dt > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DoorOpen className="size-3.5 shrink-0" />
                <span>입실가능: {formatTimestampDot(coupon.enterable_start_dt)} ~ {formatTimestampDot(coupon.enterable_end_dt)}</span>
              </div>
            )}

            {/* Day codes */}
            {coupon.day_codes && coupon.day_codes.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                <span>사용 가능 요일: {formatDayCodes(coupon.day_codes)}</span>
              </div>
            )}
          </div>

          {/* Constraints — human-readable descriptions only */}
          {visibleConstraints.length > 0 && (
            <div className="space-y-1.5">
              {visibleConstraints.map((c, i) => (
                <div
                  key={`${c.code}-${i}`}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <Info className="size-3.5 text-muted-foreground shrink-0" />
                  <span>{c.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {coupon.description && (
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
              {coupon.description}
            </p>
          )}

          {/* Remaining uses */}
          {coupon.remain_amount > 0 && (
            <p className="text-xs text-muted-foreground">
              남은 횟수: {coupon.remain_amount} / {coupon.total_amount}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
