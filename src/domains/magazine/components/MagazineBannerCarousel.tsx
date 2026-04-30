"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { MagazineBanner } from "../types"

interface Props {
  banners: MagazineBanner[]
}

export function MagazineBannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1 || paused) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [banners.length, next, paused])

  if (banners.length === 0) return null

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.key} className="relative aspect-video w-full flex-shrink-0">
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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[3.5px]">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "size-[7px] rounded-full transition-colors duration-300",
                i === current ? "bg-white" : "bg-white/40"
              )}
              onClick={() => setCurrent(i)}
              aria-label={`배너 ${i + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
