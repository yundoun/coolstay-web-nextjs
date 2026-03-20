"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMyAreaMotels } from "../hooks/useHomeData"
import { regionRecommendations as mockRegions } from "../data/mock"

interface MotelItem {
  key: string
  name: string
  images: { url: string; thumb_url: string }[]
  items?: {
    price: number
    discount_price: number
    category: { code: string; name: string }
  }[]
  rating?: { avg_score: string; review_count: number }
  benefit_point_rate?: number
  distance?: string
}

function getStayPrice(motel: MotelItem) {
  // 숙박(010102) 가격 우선, 없으면 대실(010101)
  const stayItem = motel.items?.find((i) => i.category.code === "010102")
  const rentItem = motel.items?.find((i) => i.category.code === "010101")
  const item = stayItem || rentItem
  return {
    price: item?.discount_price || item?.price || 0,
    originalPrice: item && item.price > item.discount_price ? item.price : undefined,
    label: stayItem ? "숙박" : rentItem ? "대실" : "",
  }
}

function apiMotelToLocal(motel: MotelItem) {
  const pricing = getStayPrice(motel)
  return {
    id: motel.key,
    name: motel.name,
    imageUrl: motel.images?.[0]?.url || motel.images?.[0]?.thumb_url || "",
    stayPrice: pricing.price,
    stayOriginalPrice: pricing.originalPrice,
    priceLabel: pricing.label,
    rating: parseFloat(motel.rating?.avg_score || "0"),
    reviewCount: motel.rating?.review_count || 0,
    benefitPointRate: motel.benefit_point_rate || 0,
  }
}

export function RegionRecommendations() {
  const { data: myAreaData } = useMyAreaMotels({
    latitude: "37.490812",
    longitude: "127.01012558461618",
  })

  const useApi = myAreaData?.motels && myAreaData.motels.length > 0

  const regions = useApi
    ? [{
        region: "myArea",
        label: "내 주변",
        motels: (myAreaData.motels as unknown as MotelItem[]).slice(0, 8).map(apiMotelToLocal),
      }]
    : mockRegions

  const [activeRegion, setActiveRegion] = useState(regions[0].region)
  const activeData = regions.find((r) => r.region === activeRegion) || regions[0]

  return (
    <div>
      {/* 지역 탭 */}
      <div className="flex items-center gap-1 mb-6 border-b">
        {regions.map((region) => (
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
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {motel.imageUrl ? (
                  <Image
                    src={motel.imageUrl}
                    alt={motel.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                    이미지 없음
                  </div>
                )}
                {motel.benefitPointRate > 0 && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    <Coins className="size-2.5" />
                    {motel.benefitPointRate}%
                  </div>
                )}
                {discount && discount > 0 && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-destructive text-white text-[10px] font-bold">
                    {discount}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {motel.name}
                </h4>
                {motel.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="size-3 fill-primary text-primary" />
                    <span className="text-xs font-medium">{motel.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({motel.reviewCount.toLocaleString()})
                    </span>
                  </div>
                )}
                {motel.stayPrice > 0 && (
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
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
