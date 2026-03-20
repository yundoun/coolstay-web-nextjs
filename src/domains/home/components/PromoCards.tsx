"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { promoCards } from "../data/mock"

export function PromoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {promoCards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className={cn(
            "group flex items-center gap-4 p-4 md:p-5 rounded-2xl border",
            "bg-gradient-to-br",
            card.color,
            "transition-all duration-300",
            "hover:shadow-md hover:-translate-y-0.5"
          )}
        >
          <span className="text-3xl md:text-4xl shrink-0">{card.icon}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base">{card.title}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
