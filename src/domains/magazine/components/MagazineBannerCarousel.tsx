"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MagazineBanner } from "../types"

interface Props {
  banners: MagazineBanner[]
}

export function MagazineBannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [banners.length, next])

  if (banners.length === 0) return null

  return (
    <div className="group relative overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.key} className="relative aspect-[2.5/1] w-full flex-shrink-0">
            <Image
              src={banner.image_url}
              alt={`매거진 배너 ${banner.key}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
              priority={current === 0}
            />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs text-white">
            {current + 1} / {banners.length}
          </div>
        </>
      )}
    </div>
  )
}
