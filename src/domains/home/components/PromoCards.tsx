"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LinkItem } from "@/lib/api/types"

/**
 * 프로모 카드 → 검색 타입 매핑
 *   "무제한" → ST1001 (무제한 쿠폰)
 *   "최저가" → ST1000 (국내 최저가)
 *   "첫예약" → ST1002 (첫예약 선물)
 */
const PROMO_BY_NAME: Record<string, string> = {
  무제한: "ST1001",
  최저가: "ST1000",
  첫예약: "ST1002",
}

function getPromoHref(button: LinkItem) {
  for (const [keyword, searchType] of Object.entries(PROMO_BY_NAME)) {
    if (!button.btn_name.includes(keyword)) continue
    if (searchType === "ST1001") return `/search?searchType=${searchType}&packageType=010102`
    return `/search?searchType=${searchType}`
  }
  return "#"
}

/** 앱 스타일 랜딩 버튼 색상 */
const CARD_COLORS: Record<string, { bg: string; text: string }> = {
  무제한: { bg: "bg-amber-50", text: "text-amber-700" },
  최저가: { bg: "bg-blue-50", text: "text-blue-700" },
  첫예약: { bg: "bg-pink-50", text: "text-pink-700" },
}

function getCardColor(btnName: string) {
  for (const [keyword, colors] of Object.entries(CARD_COLORS)) {
    if (btnName.includes(keyword)) return { ...colors, keyword }
  }
  return { bg: "bg-neutral-50", text: "text-neutral-700", keyword: "" }
}

interface Props {
  buttons?: LinkItem[]
}

export function PromoCards({ buttons }: Props) {
  const items = buttons?.length ? buttons : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-2 section-px">
      {items.map((button, idx) => {
        const color = getCardColor(button.btn_name)

        return (
          <Link
            key={`${button.btn_name}-${idx}`}
            href={getPromoHref(button)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5",
              "rounded-xl py-3 px-2",
              "transition-opacity active:opacity-70",
              color.bg,
            )}
          >
            {/* 썸네일 */}
            {button.thumb_url && (
              <div className="relative size-10">
                <Image
                  src={button.thumb_url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
            )}

            {/* 텍스트 */}
            <p className={cn("text-xs font-bold text-center", color.text)}>
              {button.btn_name}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
