"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useHomeFilter } from "../hooks/useHomeData"
import { promoCards as mockPromoCards } from "../data/mock"
import type { Tag } from "@/lib/api/types"

const FILTER_BIT_MAP: Record<number, { icon: string; color: string; href: string }> = {
  1:  { icon: "💰", color: "from-amber-500/10 to-yellow-500/10 border-amber-200", href: "/search?filter=lowest-price" },
  2:  { icon: "🎁", color: "from-violet-500/10 to-purple-500/10 border-violet-200", href: "/search?filter=unlimited-coupon" },
  4:  { icon: "🎉", color: "from-rose-500/10 to-pink-500/10 border-rose-200", href: "/search?filter=first-booking" },
}

function apiTagToPromo(tag: Tag) {
  const preset = FILTER_BIT_MAP[tag.filterBit] || { icon: "✨", color: "from-gray-500/10 to-gray-500/10 border-gray-200", href: "#" }
  return {
    id: String(tag.key),
    title: tag.name,
    description: "",
    icon: preset.icon,
    color: preset.color,
    href: preset.href,
  }
}

export function PromoCards() {
  const { data } = useHomeFilter()

  const filterTags = data?.tags?.filter((t) => t.type === "FILTER" && FILTER_BIT_MAP[t.filterBit])
  const cards = filterTags && filterTags.length > 0
    ? filterTags.slice(0, 3).map(apiTagToPromo)
    : mockPromoCards

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className={cn(
            "group flex items-center gap-4 p-4 md:p-5 rounded-xl border",
            "bg-gradient-to-br",
            card.color,
            "transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5"
          )}
        >
          <span className="text-3xl md:text-4xl shrink-0">{card.icon}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base">{card.title}</p>
            {card.description && (
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {card.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
