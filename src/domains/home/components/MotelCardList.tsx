"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Moon, Coins, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { homeMotels, type HomeMotel } from "../data/mock"

export function MotelCardList() {
  return (
    <div className="space-y-4">
      {homeMotels.map((motel) => (
        <MotelCard key={motel.id} motel={motel} />
      ))}
    </div>
  )
}

function MotelCard({ motel }: { motel: HomeMotel }) {
  const discount = motel.stayOriginalPrice
    ? Math.round(
        ((motel.stayOriginalPrice - motel.stayPrice) / motel.stayOriginalPrice) * 100
      )
    : null

  return (
    <Link
      href={`/accommodations/${motel.id}`}
      className={cn(
        "group flex flex-col sm:flex-row gap-0 sm:gap-4",
        "rounded-2xl border bg-card overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-lg hover:border-primary/30"
      )}
    >
      {/* Image */}
      <div className="relative w-full sm:w-56 md:w-64 aspect-[16/9] sm:aspect-auto sm:h-48 shrink-0 overflow-hidden">
        <Image
          src={motel.imageUrl}
          alt={motel.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 256px"
        />
        {/* 마일리지 버블 */}
        {motel.benefitPointRate > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            <Coins className="size-3" />
            {motel.benefitPointRate}% 적립
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 p-4 sm:py-4 sm:pr-4 sm:pl-0 flex flex-col justify-between">
        <div>
          {/* Name & Location */}
          <h3 className="font-semibold text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {motel.name}
          </h3>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1.5 text-sm">
            {motel.reviewCount > 5 && (
              <>
                <Star className="size-3.5 fill-primary text-primary" />
                <span className="font-medium">{motel.rating}</span>
                <span className="text-muted-foreground">
                  (+{motel.reviewCount.toLocaleString()})
                </span>
              </>
            )}
            <span className="text-muted-foreground">{motel.location}</span>
          </div>

          {/* Event */}
          {motel.eventTitle && (
            <div className="mt-2 flex items-center gap-1.5">
              <Tag className="size-3 text-rose-500" />
              <span className="text-xs text-rose-500 font-medium line-clamp-1">
                {motel.eventTitle}
              </span>
            </div>
          )}
        </div>

        {/* 대실/숙박 가격 */}
        <div className="mt-3 flex items-end gap-4">
          {/* 대실 */}
          {motel.rentalPrice && (
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                <Clock className="size-3" />
                <span>대실</span>
                {motel.rentalTime && (
                  <span className="text-muted-foreground/60">{motel.rentalTime}</span>
                )}
              </div>
              <span className="text-sm font-bold">
                {motel.rentalPrice.toLocaleString()}원
              </span>
            </div>
          )}

          {/* 숙박 */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
              <Moon className="size-3" />
              <span>숙박</span>
              {motel.stayTime && (
                <span className="text-muted-foreground/60">{motel.stayTime}</span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              {motel.stayOriginalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {motel.stayOriginalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold">
                {motel.stayPrice.toLocaleString()}원
              </span>
              {discount && (
                <span className="text-xs font-bold text-rose-500">{discount}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
