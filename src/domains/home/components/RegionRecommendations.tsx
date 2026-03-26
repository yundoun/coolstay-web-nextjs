"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRegionStores } from "../hooks/useHomeData"
import type { RegionCategory, StoreItem } from "@/lib/api/types"

function getStayPrice(store: StoreItem) {
  const stayItem = store.items?.find((i) => i.category.code === "010102")
  const rentItem = store.items?.find((i) => i.category.code === "010101")
  const item = stayItem || rentItem
  return {
    price: item?.discount_price || item?.price || 0,
    originalPrice: item && item.price > item.discount_price ? item.price : undefined,
    label: stayItem ? "숙박" : rentItem ? "대실" : "",
  }
}

interface Props {
  categories?: RegionCategory[]
  stores?: StoreItem[]
}

export function RegionRecommendations({ categories, stores }: Props) {
  const tabs = categories?.filter((c) => c.open_yn === "Y").slice(0, 10) || []
  const [activeCode, setActiveCode] = useState<string | undefined>(undefined)

  // 탭 전환 시 해당 지역 숙소 조회
  const { data: regionData } = useRegionStores(activeCode)

  // activeCode가 없으면 초기 데이터(home/main의 recommend_stores) 사용
  const displayStores = activeCode
    ? regionData?.recommend_stores || []
    : stores || []

  if (tabs.length === 0 && displayStores.length === 0) return null

  return (
    <div>
      {/* 지역 탭 */}
      {tabs.length > 0 && (
        <div className="flex items-center gap-1 mb-6 border-b overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => setActiveCode(tab.code === activeCode ? undefined : tab.code)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-all relative shrink-0",
                (activeCode === undefined && tab === tabs[0]) || activeCode === tab.code
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
              {((activeCode === undefined && tab === tabs[0]) || activeCode === tab.code) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* 숙소 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {displayStores.slice(0, 8).map((store) => {
          const pricing = getStayPrice(store)
          const discount = pricing.originalPrice
            ? Math.round(((pricing.originalPrice - pricing.price) / pricing.originalPrice) * 100)
            : null

          return (
            <Link
              key={store.key}
              href={`/accommodations/${store.key}`}
              className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {store.images?.[0] ? (
                  <Image
                    src={store.images[0].url || store.images[0].thumb_url}
                    alt={store.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                    이미지 없음
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
                  {store.name}
                </h4>
                {store.like_count > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="size-3 fill-primary text-primary" />
                    <span className="text-xs text-muted-foreground">
                      찜 {store.like_count.toLocaleString()}
                    </span>
                  </div>
                )}
                {pricing.price > 0 && (
                  <div className="mt-2 flex items-baseline gap-1">
                    {pricing.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {pricing.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-sm font-bold">
                      {pricing.price.toLocaleString()}원
                    </span>
                    {pricing.label && (
                      <span className="text-[10px] text-muted-foreground">
                        {pricing.label}
                      </span>
                    )}
                  </div>
                )}
                {/* 쿠폰 뱃지 */}
                {store.items?.[0]?.coupons?.length ? (
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                      <Coins className="size-2.5" />
                      쿠폰 {store.items[0].coupons[0].discount_amount.toLocaleString()}원
                    </span>
                  </div>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
