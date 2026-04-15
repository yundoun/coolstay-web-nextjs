"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StoreItem } from "@/lib/api/types"

interface Props {
  stores: StoreItem[]
}

export function RecentlyViewed({ stores }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (stores.length === 0) return null

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative group/carousel">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -left-3 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full",
          "bg-white/70 backdrop-blur-md shadow-md",
          "hidden md:flex",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        )}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full",
          "bg-white/70 backdrop-blur-md shadow-md",
          "hidden md:flex",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="size-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
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
              className={cn(
                "shrink-0 w-44 snap-start group",
                "rounded-2xl overflow-hidden",
                "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              )}
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                {store.images?.[0] ? (
                  <Image
                    src={store.images[0].url || store.images[0].thumb_url}
                    alt={store.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="176px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-xs text-muted-foreground">
                    이미지 없음
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium line-clamp-1">{store.name}</p>
                {price > 0 && (
                  <p className="text-sm font-bold mt-1">
                    {price.toLocaleString()}원
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
