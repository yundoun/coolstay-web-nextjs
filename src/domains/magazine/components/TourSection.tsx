"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTourSpots } from "../hooks/useMagazine"

const TABS = [
  { label: "관광지", contentTypeId: 12 },
  { label: "문화시설", contentTypeId: 14 },
  { label: "축제", contentTypeId: 15 },
  { label: "음식점", contentTypeId: 39 },
] as const

interface Props {
  areaCode?: number
  sigunguCode?: number
}

export function TourSection({ areaCode, sigunguCode }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const contentTypeId = TABS[activeTab].contentTypeId

  const { data, isLoading, isError } = useTourSpots(contentTypeId, areaCode, sigunguCode)

  const items = data?.response?.body?.items?.item ?? []

  if (isError) return null

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-2 px-4 mb-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.contentTypeId}
            type="button"
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
              i === activeTab
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카드 목록 */}
      {isLoading ? (
        <div className="flex gap-3 px-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-[174px] h-[200px] rounded-xl shrink-0" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          해당 지역의 관광정보가 없습니다
        </div>
      ) : (
        <div className="flex gap-[15px] overflow-x-auto px-4 pb-1 scrollbar-hide">
          {items.map((item) => (
            <div
              key={item.contentid}
              className="shrink-0 w-[174px]"
            >
              <div className="relative w-[174px] h-[160px] rounded-xl overflow-hidden bg-muted">
                {item.firstimage ? (
                  <Image
                    src={item.firstimage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="174px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                    이미지 없음
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-tight">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
