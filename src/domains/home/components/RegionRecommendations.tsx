"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { RegionCardSkeleton } from "@/components/skeleton"
import { cn } from "@/lib/utils"
import { useRegionStores } from "../hooks/useHomeData"
import type { RegionCategory, StoreItem } from "@/lib/api/types"

function getStayPrice(store: StoreItem) {
  let stayItem = store.items?.find((i) => i.category?.code === "010102")
  let rentItem = store.items?.find((i) => i.category?.code === "010101")
  if (!stayItem && !rentItem) {
    for (const item of store.items ?? []) {
      if (item.sub_items?.length) {
        if (!stayItem) stayItem = item.sub_items.find((si) => si.category?.code === "010102")
        if (!rentItem) rentItem = item.sub_items.find((si) => si.category?.code === "010101")
      }
    }
  }
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

const PAGE_SIZE = 4

export function RegionRecommendations({ categories, stores }: Props) {
  const tabs = categories?.filter((c) => c.open_yn === "Y").slice(0, 10) || []
  const [activeCode, setActiveCode] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(0)

  const { data: regionData, isFetching } = useRegionStores(activeCode)

  const isLoading = !!activeCode && isFetching && !regionData

  const displayStores = activeCode
    ? regionData?.recommend_stores || []
    : stores || []

  const totalPages = Math.max(1, Math.ceil(displayStores.length / PAGE_SIZE))
  const pagedStores = displayStores.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  if (tabs.length === 0 && displayStores.length === 0) return null

  return (
    <div>
      {/* 타이틀 + 새로운 추천 버튼 */}
      <div className="flex items-center justify-between section-px mb-3">
        <h2 className="text-base font-bold tracking-tight">이런 숙소는 어떠세요?</h2>
        {displayStores.length > 0 && (
          <button
            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
            </svg>
            새로운 추천
          </button>
        )}
      </div>

      {/* 지역 탭 — 앱 스타일 밑줄 탭 */}
      {tabs.length > 0 && (
        <div className="section-px mb-4"><div className="flex items-center gap-0 border-b overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = (activeCode === undefined && tab === tabs[0]) || activeCode === tab.code
            return (
              <button
                key={tab.code}
                onClick={() => {
                  setActiveCode(tab.code === activeCode ? undefined : tab.code)
                  setPage(0)
                }}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all relative shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            )
          })}
        </div></div>
      )}

      {/* 숙소 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 section-px">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <RegionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 section-px">
        {pagedStores.map((store) => {
          const pricing = getStayPrice(store)
          const discount = pricing.originalPrice
            ? Math.round(((pricing.originalPrice - pricing.price) / pricing.originalPrice) * 100)
            : null
          const hasCoupon = store.download_coupon_info && store.download_coupon_info.status !== "NON_TARGET"

          return (
            <Link
              key={store.key}
              href={`/accommodations/${store.key}`}
              className="group rounded-xl overflow-hidden border border-border bg-white transition-opacity active:opacity-70"
            >
              {/* 썸네일 */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                {store.images?.[0] ? (
                  <Image
                    src={store.images[0].url || store.images[0].thumb_url}
                    alt={store.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-1">
                    <span className="text-2xl">🐝</span>
                    이미지 준비중
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div className="p-3">
                {/* 쿠폰 배지 */}
                {hasCoupon && (
                  <span className="inline-block text-[11px] font-medium text-[#FF6C2C] border border-[#FF6C2C] rounded px-1.5 py-0.5 mb-1.5">
                    선착순 쿠폰
                  </span>
                )}

                {/* 숙소명 */}
                <h4 className="text-sm font-medium line-clamp-1">
                  {store.name}
                </h4>

                {/* 하단: 하트 + 가격 */}
                <div className="flex items-center justify-between mt-2">
                  <Heart className="size-5 text-neutral-300" />
                  <div className="flex items-baseline gap-1">
                    {discount != null && discount > 0 && (
                      <span className="text-sm font-bold text-[#FF6C2C]">
                        {discount}%
                      </span>
                    )}
                    {pricing.price > 0 ? (
                      <span className="text-sm font-bold">
                        {pricing.price.toLocaleString()}원
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">예약마감</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      )}
    </div>
  )
}
