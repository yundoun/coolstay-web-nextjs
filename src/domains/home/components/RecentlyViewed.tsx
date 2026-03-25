"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { recentMotels } from "../data/mock"

export function RecentlyViewed() {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (recentMotels.length === 0) return null

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
          "bg-background/90 shadow-md border",
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
          "bg-background/90 shadow-md border",
          "hidden md:flex",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="size-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
      >
        {recentMotels.map((motel) => (
          <Link
            key={motel.id}
            href={`/accommodations/${motel.id}`}
            className={cn(
              "shrink-0 w-44 snap-start group",
              "rounded-xl overflow-hidden border bg-card",
              "transition-all duration-300 hover:shadow-lg"
            )}
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={motel.imageUrl}
                alt={motel.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="176px"
              />
              {motel.mileageAvailable && (
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  무제한 {motel.mileageAvailable.toLocaleString()}원 사용가능
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-sm font-medium line-clamp-1">{motel.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="size-3 fill-primary text-primary" />
                <span className="text-xs">{motel.rating}</span>
                <span className="text-xs text-muted-foreground">{motel.location}</span>
              </div>
              <p className="text-sm font-bold mt-1">
                {motel.stayPrice.toLocaleString()}원
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
