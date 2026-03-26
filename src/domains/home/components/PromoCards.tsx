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

function getPromoHref(button: LinkItem) {
  if (button.sub_type === "A_HM_11") return "/search?filter=promo"
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
