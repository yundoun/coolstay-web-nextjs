"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LinkItem } from "@/lib/api/types"

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
  for (const [keyword, searchType] of Object.entries(PROMO_BY_NAME)) {
    if (!button.btn_name.includes(keyword)) continue
    if (searchType === "ST1001") return `/search?searchType=${searchType}&packageType=010102`
    return `/search?searchType=${searchType}`
  }
  return "#"
}

/** 카드별 글래스모피즘 테마 */
interface CardTheme {
  orbs: Array<{ position: string; color: string; opacity: number }>
  badge: string
  sub: string
  glowColor: string
}

const CARD_THEMES: Record<string, CardTheme> = {
  무제한: {
    orbs: [
      { position: "20% 50%", color: "rgba(255,198,0,0.55)", opacity: 0.8 },
      { position: "85% 20%", color: "rgba(251,191,36,0.4)", opacity: 0.6 },
    ],
    badge: "bg-amber-500/20 text-amber-800",
    sub: "쿠폰으로 할인받기",
    glowColor: "rgba(255,198,0,0.2)",
  },
  최저가: {
    orbs: [
      { position: "75% 60%", color: "rgba(59,130,246,0.45)", opacity: 0.75 },
      { position: "15% 25%", color: "rgba(139,92,246,0.35)", opacity: 0.6 },
    ],
    badge: "bg-blue-500/20 text-blue-800",
    sub: "국내 최저가 보장",
    glowColor: "rgba(59,130,246,0.15)",
  },
  첫예약: {
    orbs: [
      { position: "25% 70%", color: "rgba(236,72,153,0.4)", opacity: 0.75 },
      { position: "80% 25%", color: "rgba(244,114,182,0.3)", opacity: 0.55 },
    ],
    badge: "bg-pink-500/20 text-pink-800",
    sub: "첫 예약 특별 혜택",
    glowColor: "rgba(236,72,153,0.15)",
  },
}

const FALLBACK_THEME: CardTheme = {
  orbs: [{ position: "50% 50%", color: "rgba(120,113,108,0.25)", opacity: 0.6 }],
  badge: "bg-neutral-500/15 text-neutral-600",
  sub: "",
  glowColor: "rgba(120,113,108,0.1)",
}

function getTheme(btnName: string): CardTheme & { keyword: string } {
  for (const [keyword, theme] of Object.entries(CARD_THEMES)) {
    if (btnName.includes(keyword)) return { ...theme, keyword }
  }
  return { ...FALLBACK_THEME, keyword: "" }
}

interface Props {
  buttons?: LinkItem[]
}

export function PromoCards({ buttons }: Props) {
  const items = buttons?.length ? buttons : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((button, idx) => {
        const theme = getTheme(button.btn_name)

        return (
          <Link
            key={`${button.btn_name}-${idx}`}
            href={getPromoHref(button)}
            className={cn(
              "group relative flex flex-col justify-between",
              "overflow-hidden rounded-2xl p-5 sm:p-6",
              "min-h-[130px] sm:min-h-[150px]",
              // Hover
              "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              "hover:scale-[1.02] hover:shadow-xl",
            )}
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: `inset 0 0 0 1px ${theme.glowColor}, 0 1px 3px rgba(0,0,0,0.06)`,
            }}
          >
            {/* 그라데이션 Orb 배경 */}
            {theme.orbs.map((orb, i) => (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  opacity: orb.opacity,
                  background: `radial-gradient(circle at ${orb.position}, ${orb.color} 0%, transparent 55%)`,
                }}
              />
            ))}

            {/* 노이즈 텍스처 */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* 썸네일 */}
            {button.thumb_url && (
              <div className="absolute right-4 top-4 z-10 size-9 opacity-40 transition-opacity duration-200 group-hover:opacity-60 sm:size-10">
                <Image
                  src={button.thumb_url}
                  alt=""
                  fill
                  className="object-contain drop-shadow-sm"
                  sizes="40px"
                />
              </div>
            )}

            {/* 배지 */}
            {theme.keyword && (
              <span
                className={cn(
                  "relative z-10 inline-flex w-fit items-center rounded-full",
                  "px-2.5 py-1 text-[11px] font-bold tracking-wide",
                  "backdrop-blur-sm",
                  theme.badge,
                )}
              >
                {theme.keyword}
              </span>
            )}

            {/* 타이틀 + 설명 */}
            <div className="relative z-10 mt-auto pt-3">
              <p className="text-[15px] font-bold leading-snug text-neutral-800 sm:text-base">
                {button.btn_name}
              </p>
              {theme.sub && (
                <p className="mt-0.5 text-xs font-medium text-neutral-500">
                  {theme.sub}
                </p>
              )}
            </div>

            {/* 화살표 */}
            <svg
              className={cn(
                "absolute bottom-4 right-4 z-10 size-4 text-neutral-400",
                "opacity-0 transition-all duration-200",
                "group-hover:opacity-100 group-hover:translate-x-0.5",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* 상단 하이라이트 (유리 반사 효과) */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
              }}
            />
          </Link>
        )
      })}
    </div>
  )
}
