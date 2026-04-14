"use client"

import { Gift, Ticket, Star, Crown, Percent, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AccommodationDetail } from "../types"

interface BenefitSectionProps {
  accommodation: AccommodationDetail
}

const SUPPORT_FLAG_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  first_reserve: { label: "첫 예약 할인", icon: Star },
  low_price_korea: { label: "최저가 보장", icon: Crown },
  visit_korea: { label: "한국관광 인증", icon: Zap },
  favor_coupon_store: { label: "쿠폰 우대 숙소", icon: Ticket },
  unlimited_coupon: { label: "무제한 쿠폰", icon: Gift },
  revisit: { label: "재방문 혜택", icon: Percent },
}

const BENEFIT_COLORS = [
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-purple-50 border-purple-200 text-purple-800",
  "bg-emerald-50 border-emerald-200 text-emerald-800",
  "bg-amber-50 border-amber-200 text-amber-800",
  "bg-rose-50 border-rose-200 text-rose-800",
  "bg-cyan-50 border-cyan-200 text-cyan-800",
]

export function BenefitSection({ accommodation }: BenefitSectionProps) {
  const {
    benefits,
    downloadCouponInfo,
    v2SupportFlag,
    consecutiveYn,
    benefitPointRate,
  } = accommodation

  const activeBenefits = benefits.filter((b) => b.active_yn === "Y")
  const hasCouponDownload =
    downloadCouponInfo && downloadCouponInfo.status !== "NON_TARGET"

  const activeSupportFlags = v2SupportFlag
    ? Object.entries(v2SupportFlag).filter(
        ([key, val]) => val === true && SUPPORT_FLAG_LABELS[key]
      )
    : []

  const hasConsecutive = consecutiveYn === "Y"
  const hasMileage = benefitPointRate > 0

  const hasAnything =
    activeBenefits.length > 0 ||
    hasCouponDownload ||
    activeSupportFlags.length > 0 ||
    hasConsecutive ||
    hasMileage

  if (!hasAnything) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">꿀혜택</h2>

      {/* Badges: 쿠폰 다운로드, 연박 할인, 마일리지, v2SupportFlag */}
      <div className="flex flex-wrap gap-2 mb-4">
        {hasCouponDownload && (
          <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Ticket className="size-3.5" />
            쿠폰 다운로드 가능
          </Badge>
        )}
        {hasConsecutive && (
          <Badge className="gap-1 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
            <Crown className="size-3.5" />
            연박 할인
          </Badge>
        )}
        {hasMileage && (
          <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <Percent className="size-3.5" />
            +{benefitPointRate}% 적립
            {accommodation.paymentBenefit?.benefit_more_yn === "Y" && " +α"}
          </Badge>
        )}
        {activeSupportFlags.map(([key]) => {
          const config = SUPPORT_FLAG_LABELS[key]
          const Icon = config.icon
          return (
            <Badge
              key={key}
              className="gap-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            >
              <Icon className="size-3.5" />
              {config.label}
            </Badge>
          )
        })}
      </div>

      {/* Benefit Cards */}
      {activeBenefits.length > 0 && (
        <div className="grid gap-3">
          {activeBenefits
            .sort((a, b) => a.priority - b.priority)
            .map((benefit, index) => {
              const colorClass =
                BENEFIT_COLORS[index % BENEFIT_COLORS.length]
              return (
                <div
                  key={`${benefit.name}-${index}`}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${colorClass}`}
                >
                  {benefit.image_url ? (
                    <img
                      src={benefit.image_url}
                      alt={benefit.name}
                      className="size-8 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <Gift className="size-5 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{benefit.name}</p>
                    <p className="text-xs mt-0.5 opacity-80">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
