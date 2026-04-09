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
      // AOS 앱과 동일: mapping_business_types 전체를 콤마 구분으로 전달
      openWithBusinessType(types.join(","), types)
    }
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {items.map((item, idx) => {
        // 기획전, 비활성 등 특수 링크는 기존 Link 유지
        const specialHref = SPECIAL_HREF[item.sub_type]
        if (specialHref) {
          return (
            <Link
              key={`${item.btn_name}-${idx}`}
              href={specialHref}
              className={cn(
                "flex flex-col items-center gap-2 py-3 px-2 rounded-xl",
                "transition-all duration-200",
                "hover:bg-muted hover:shadow-sm hover:-translate-y-0.5"
              )}
            >
              <CategoryIcon item={item} />
              <CategoryLabel name={item.btn_name} />
            </Link>
          )
        }

        // 업태 버튼 → 지역 선택 모달
        return (
          <button
            key={`${item.btn_name}-${idx}`}
            onClick={() => handleClick(item)}
            className={cn(
              "flex flex-col items-center gap-2 py-3 px-2 rounded-xl",
              "transition-all duration-200",
              "hover:bg-muted hover:shadow-sm hover:-translate-y-0.5"
            )}
          >
            <CategoryIcon item={item} />
            <CategoryLabel name={item.btn_name} />
          </button>
        )
      })}
    </div>
  )
}

function CategoryIcon({ item }: { item: LinkItem }) {
  if (item.thumb_url) {
    return (
      <div className="relative size-10 md:size-12">
        <Image
          src={item.thumb_url}
          alt={item.btn_name}
          fill
          className="object-contain"
          sizes="48px"
        />
      </div>
    )
  }
  return (
    <div className="size-10 md:size-12 rounded-full bg-muted flex items-center justify-center text-lg">
      🏨
    </div>
  )
}

function CategoryLabel({ name }: { name: string }) {
  return (
    <span className="text-xs font-medium text-muted-foreground text-center line-clamp-1">
      {name}
    </span>
  )
}
