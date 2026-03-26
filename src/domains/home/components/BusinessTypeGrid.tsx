"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LinkItem } from "@/lib/api/types"

// 업종 → 검색 URL 매핑
const BUSINESS_TYPE_HREF: Record<string, string> = {
  MOTEL: "/search?type=MOTEL",
  HOTEL: "/search?type=HOTEL",
  RESORT: "/search?type=RESORT",
  PENSION: "/search?type=PENSION",
  CAMPING: "/search?type=CAMPING",
  GLAMPING: "/search?type=GLAMPING",
  GUESTHOUSE: "/search?type=GUESTHOUSE",
  HANOK: "/search?type=HANOK",
  POOLVILLA: "/search?type=POOLVILLA",
  RESIDENCE: "/search?type=RESIDENCE",
  CARAVAN: "/search?type=CARAVAN",
}

function getHref(item: LinkItem) {
  // sub_type에 따라 분기
  if (item.sub_type === "A_CR_01") return "/exhibitions" // 기획전목록
  if (item.sub_type === "A_MR_07") return "#" // 배경 등 비활성

  // mapping_business_types에서 첫 번째 업종으로 검색 링크
  const bizType = item.mapping_business_types?.[0]
  if (bizType && BUSINESS_TYPE_HREF[bizType]) {
    return BUSINESS_TYPE_HREF[bizType]
  }
  return `/search?target=${item.target || ""}`
}

interface Props {
  categories?: LinkItem[]
}

export function BusinessTypeGrid({ categories }: Props) {
  const items = categories?.length ? categories : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {items.map((item, idx) => (
        <Link
          key={`${item.btn_name}-${idx}`}
          href={getHref(item)}
          className={cn(
            "flex flex-col items-center gap-2 py-3 px-2 rounded-xl",
            "transition-all duration-200",
            "hover:bg-muted hover:shadow-sm hover:-translate-y-0.5"
          )}
        >
          {item.thumb_url ? (
            <div className="relative size-10 md:size-12">
              <Image
                src={item.thumb_url}
                alt={item.btn_name}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="size-10 md:size-12 rounded-full bg-muted flex items-center justify-center text-lg">
              🏨
            </div>
          )}
          <span className="text-xs font-medium text-muted-foreground text-center line-clamp-1">
            {item.btn_name}
          </span>
        </Link>
      ))}
    </div>
  )
}
