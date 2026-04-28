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
    <div className="grid grid-cols-4 gap-y-3 gap-x-2 section-px">
      {items.map((item, idx) => {
        const specialHref = SPECIAL_HREF[item.sub_type]

        const content = (
          <>
            <CategoryIcon item={item} />
            <span className="mt-1.5 text-xs font-medium text-[#32353b] text-center line-clamp-1">
              {item.btn_name}
            </span>
          </>
        )

        const itemClass = cn(
          "flex flex-col items-center justify-center",
          "py-1 transition-opacity active:opacity-70",
        )

        if (specialHref) {
          return (
            <Link
              key={`${item.btn_name}-${idx}`}
              href={specialHref}
              className={itemClass}
            >
              {content}
            </Link>
          )
        }

        if (item.type === "URL" && item.target) {
          return (
            <a
              key={`${item.btn_name}-${idx}`}
              href={item.target}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass}
            >
              {content}
            </a>
          )
        }

        return (
          <button
            key={`${item.btn_name}-${idx}`}
            onClick={() => handleClick(item)}
            className={itemClass}
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
      <div className="relative size-14">
        <Image
          src={item.thumb_url}
          alt={item.btn_name}
          fill
          className="object-contain"
          sizes="56px"
        />
      </div>
    )
  }
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-lg">
      🏨
    </div>
  )
}
