"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EcoBadge, PremiumBadge, LocalPickBadge, NewBadge } from "@/components/badges"
import { cn } from "@/lib/utils"
import type { SearchAccommodation, BentoSize, BadgeType } from "../types"

interface BentoAccommodationCardProps {
  accommodation: SearchAccommodation
  size?: BentoSize
  priority?: boolean
}

export function BentoAccommodationCard({
  accommodation,
  size = "small",
  priority = false,
}: BentoAccommodationCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const cardSize = accommodation.bentoSize || size

  const discount = accommodation.originalPrice
    ? Math.round(
        ((accommodation.originalPrice - accommodation.price) /
          accommodation.originalPrice) *
          100
      )
    : null

  const desktopLayoutClasses: Record<BentoSize, string> = {
    large: "md:col-span-2 md:row-span-2",
    wide: "md:col-span-2 md:row-span-1",
    tall: "md:col-span-1 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
  }

  const isLargeCard = cardSize === "large" || cardSize === "tall"

  return (
    <Link
      href={`/accommodations/${accommodation.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl",
        "transition-all duration-500",
        "hover:shadow-2xl hover:shadow-black/20",
        "col-span-1 row-span-1",
        desktopLayoutClasses[cardSize]
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={accommodation.imageUrl}
          alt={accommodation.name}
          fill
          priority={priority}
          className={cn(
            "object-cover",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-110"
          )}
          sizes={
            cardSize === "large"
              ? "(max-width: 768px) 50vw, 50vw"
              : cardSize === "wide"
              ? "(max-width: 768px) 50vw, 50vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
        />
      </div>

      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
          "transition-opacity duration-300",
          "group-hover:from-black/90"
        )}
      />

      <div className="absolute top-2 left-2 right-10 md:top-3 md:left-3 md:right-12 flex flex-wrap gap-1">
        {accommodation.badges?.map((badge) => (
          <BadgeRenderer key={badge} type={badge} size="sm" />
        ))}
        {discount && (
          <div className="inline-flex items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] md:px-2 md:text-xs font-bold text-white">
            {discount}%
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-2 size-8 md:right-3 md:top-3 md:size-9 rounded-full",
          "bg-black/20 backdrop-blur-sm",
          "text-white hover:text-white",
          "transition-all duration-300",
          "hover:bg-black/40 hover:scale-110",
          isLiked && "text-rose-500 hover:text-rose-500"
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsLiked(!isLiked)
        }}
      >
        <Heart
          className={cn(
            "size-4 md:size-5 transition-all duration-300",
            isLiked && "fill-current scale-110"
          )}
        />
        <span className="sr-only">찜하기</span>
      </Button>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <div className="space-y-0.5 md:space-y-1">
          <h3
            className={cn(
              "font-bold text-white line-clamp-1 drop-shadow-lg",
              "text-sm md:text-base",
              isLargeCard && "md:text-lg"
            )}
          >
            {accommodation.name}
          </h3>

          <p className="text-xs md:text-sm text-white/80 line-clamp-1">
            {accommodation.location}
          </p>

          <div className="flex items-baseline gap-1 md:gap-2 pt-0.5">
            {accommodation.originalPrice && (
              <span className="text-xs text-white/50 line-through hidden md:inline">
                {accommodation.originalPrice.toLocaleString()}원
              </span>
            )}
            <span className="text-sm md:text-base font-bold text-white">
              {accommodation.price.toLocaleString()}원
            </span>
            <span className="text-xs text-white/70">/박</span>
          </div>

          <div className="flex items-center gap-1 pt-0.5">
            <Star className="size-3 md:size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs md:text-sm font-medium text-white">
              {accommodation.rating}
            </span>
            <span className="text-[10px] md:text-xs text-white/60">
              ({accommodation.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-primary/5",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
      />
    </Link>
  )
}

function BadgeRenderer({
  type,
  size = "md",
}: {
  type: BadgeType
  size?: "sm" | "md"
}) {
  switch (type) {
    case "eco":
      return <EcoBadge size={size} />
    case "premium":
      return <PremiumBadge size={size} />
    case "localPick":
      return <LocalPickBadge size={size} />
    case "new":
      return <NewBadge size={size} />
    default:
      return null
  }
}
