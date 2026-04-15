"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"
import type { LinkItem } from "@/lib/api/types"

// sub_type → 네비게이션 URL 매핑
const SPECIAL_HREF: Record<string, string> = {
  A_CR_01: "/exhibitions",  // 기획전목록
  A_MR_07: "/coupons",      // 쿠폰함 (로그인 필요)
  A_CP_01: "/coupons",      // 쿠폰함 (GNB)
}

interface Props {
  categories?: LinkItem[]
}

export function BusinessTypeGrid({ categories }: Props) {
  const { openWithBusinessType } = useSearchModal()
  const items = categories?.length ? categories : []
  if (items.length === 0) return null

  const handleClick = (item: LinkItem) => {
    const types = item.mapping_business_types
    if (types?.length) {
      openWithBusinessType(types.join(","), types)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-2.5">
      {items.map((item, idx) => {
        const specialHref = SPECIAL_HREF[item.sub_type]

        const content = (
          <>

            {/* 아이콘 */}
            <div className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-110">
              <CategoryIcon item={item} />
            </div>

            {/* 라벨 */}
            <span className="relative z-10 mt-1.5 text-[11px] font-semibold text-neutral-700 text-center line-clamp-1 sm:text-xs">
              {item.btn_name}
            </span>
          </>
        )

        const cardClass = cn(
          "group relative flex flex-col items-center justify-center",
          "rounded-2xl px-2 py-3.5 sm:py-4",
          "overflow-hidden",
          "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:scale-[1.04] hover:shadow-md",
        )

        const cardStyle = {
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.04)",
        }

        if (specialHref) {
          return (
            <Link
              key={`${item.btn_name}-${idx}`}
              href={specialHref}
              className={cardClass}
              style={cardStyle}
            >
              {content}
            </Link>
          )
        }

        return (
          <button
            key={`${item.btn_name}-${idx}`}
            onClick={() => handleClick(item)}
            className={cardClass}
            style={cardStyle}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}

function CategoryIcon({ item }: { item: LinkItem }) {
  if (item.thumb_url) {
    return (
      <div className="relative size-10 drop-shadow-sm sm:size-11">
        <Image
          src={item.thumb_url}
          alt={item.btn_name}
          fill
          className="object-contain"
          sizes="44px"
        />
      </div>
    )
  }
  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-white/60 text-lg backdrop-blur-sm sm:size-11">
      🏨
    </div>
  )
}
