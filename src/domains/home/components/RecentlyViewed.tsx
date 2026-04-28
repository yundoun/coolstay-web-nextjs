"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { StoreItem } from "@/lib/api/types"

interface Props {
  stores: StoreItem[]
}

export function RecentlyViewed({ stores }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })

  if (stores.length === 0) return null

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragState.current = { startX: e.pageX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const dx = e.pageX - dragState.current.startX
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx
  }
  const onMouseUp = () => setIsDragging(false)

  return (
    <div className="section-px">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {stores.map((store) => {
          const stayItem = store.items?.find((i) => i.category.code === "010102")
          const rentItem = store.items?.find((i) => i.category.code === "010101")
          const item = stayItem || rentItem
          const price = item?.discount_price || item?.price || 0

          return (
            <Link
              key={store.key}
              href={`/accommodations/${store.key}`}
              className={cn("shrink-0 w-[132px]", isDragging && "pointer-events-none")}
              draggable={false}
            >
              <div className="relative w-[132px] h-[102px] rounded-lg overflow-hidden bg-neutral-100">
                {store.images?.[0] ? (
                  <Image
                    src={store.images[0].url || store.images[0].thumb_url}
                    alt={store.name}
                    fill
                    className="object-cover"
                    sizes="132px"
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                    이미지 없음
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs font-bold text-[#444444] line-clamp-1">{store.name}</p>
              {price > 0 && (
                <p className="text-xs text-[#444444] mt-0.5">{price.toLocaleString()}원~</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
