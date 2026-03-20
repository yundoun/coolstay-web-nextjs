"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { regionRecommendations } from "../data/mock"

export function RegionRecommendations() {
  const [activeRegion, setActiveRegion] = useState(regionRecommendations[0].region)
  const activeData = regionRecommendations.find((r) => r.region === activeRegion)!

  return (
    <div>
      {/* 지역 탭 */}
      <div className="flex items-center gap-1 mb-6 border-b">
        {regionRecommendations.map((region) => (
          <button
            key={region.region}
            onClick={() => setActiveRegion(region.region)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all relative",
              activeRegion === region.region
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {region.label}
            {activeRegion === region.region && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        ))}
        <Link
          href={`/search?region=${activeRegion}`}
          className="ml-auto text-xs text-primary hover:underline underline-offset-2 shrink-0"
        >
          더보기
        </Link>
      </div>

      {/* 숙소 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {activeData.motels.map((motel) => {
          const discount = motel.stayOriginalPrice
            ? Math.round(((motel.stayOriginalPrice - motel.stayPrice) / motel.stayOriginalPrice) * 100)
            : null

          return (
            <Link
              key={motel.id}
              href={`/accommodations/${motel.id}`}
              className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={motel.imageUrl}
                  alt={motel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {motel.benefitPointRate > 0 && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    <Coins className="size-2.5" />
                    {motel.benefitPointRate}%
                  </div>
                )}
                {discount && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-destructive text-white text-[10px] font-bold">
                    {discount}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {motel.name}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="size-3 fill-primary text-primary" />
                  <span className="text-xs font-medium">{motel.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({motel.reviewCount.toLocaleString()})
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  {motel.stayOriginalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {motel.stayOriginalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-sm font-bold">
                    {motel.stayPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
