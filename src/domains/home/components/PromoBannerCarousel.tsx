"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HomeBanner } from "@/lib/api/types"

interface Props {
  banners?: HomeBanner[]
}

export function PromoBannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0)

  const items = banners?.length ? banners : []
  if (items.length === 0) return null

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((banner) => (
          <div
            key={banner.key}
            className="relative w-full shrink-0 aspect-[3/1] md:aspect-[4/1]"
          >
            <Image
              src={banner.image_urls?.[0] || ""}
              alt={`배너 ${banner.key}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full",
          "bg-background/30 text-white backdrop-blur-sm",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-background/50 hover:text-white"
        )}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full",
          "bg-background/30 text-white backdrop-blur-sm",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-background/50 hover:text-white"
        )}
      >
        <ChevronRight className="size-5" />
      </Button>

      {/* Dots + counter */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1.5">
        <span className="text-xs text-white/80 font-medium bg-black/40 px-2 py-0.5 rounded-full">
          {current + 1} / {items.length}
        </span>
      </div>
    </div>
  )
}
