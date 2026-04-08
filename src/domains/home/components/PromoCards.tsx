"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LinkItem } from "@/lib/api/types"

const PROMO_COLORS = [
  "from-violet-500/10 to-purple-500/10 border-violet-200",
  "from-amber-500/10 to-yellow-500/10 border-amber-200",
  "from-rose-500/10 to-pink-500/10 border-rose-200",
]

/**
 * 프로모 카드 → 검색 타입 매핑
 * API 응답의 sub_type이 중복(무제한·첫예약 모두 A_HM_11)이므로 btn_name으로 구분
 *   "무제한" → ST1001 (무제한 쿠폰)
 *   "최저가" → ST1000 (국내 최저가)
 *   "첫예약" → ST1002 (첫예약 선물)
 * AOS: HomeNavigationViewModel → LocationSearchedActivity
 */
const PROMO_BY_NAME: Record<string, string> = {
  무제한: "ST1001",
  최저가: "ST1000",
  첫예약: "ST1002",
}

function getPromoHref(button: LinkItem) {
  // btn_name에 키워드가 포함되면 매칭 (e.g. "무제한 쿠폰" → "무제한")
  for (const [keyword, searchType] of Object.entries(PROMO_BY_NAME)) {
    if (!button.btn_name.includes(keyword)) continue
    // ST1001(무제한쿠폰)은 packageType 필수 — 기본 숙박(010102), AOS 동일
    if (searchType === "ST1001") return `/search?searchType=${searchType}&packageType=010102`
    return `/search?searchType=${searchType}`
  }
  return "#"
}

interface Props {
  buttons?: LinkItem[]
}

export function PromoCards({ buttons }: Props) {
  const items = buttons?.length ? buttons : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((button, idx) => (
        <Link
          key={`${button.btn_name}-${idx}`}
          href={getPromoHref(button)}
          className={cn(
            "group flex items-center gap-4 p-4 md:p-5 rounded-xl border",
            "bg-gradient-to-br",
            PROMO_COLORS[idx % PROMO_COLORS.length],
            "transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5"
          )}
        >
          {button.thumb_url ? (
            <div className="relative size-10 md:size-12 shrink-0">
              <Image
                src={button.thumb_url}
                alt={button.btn_name}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
          ) : button.bg_url ? (
            <div className="relative size-10 md:size-12 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={button.bg_url}
                alt={button.btn_name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <span className="text-3xl md:text-4xl shrink-0">🎁</span>
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base">{button.btn_name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
