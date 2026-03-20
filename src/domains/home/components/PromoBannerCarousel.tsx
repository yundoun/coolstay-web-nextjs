"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { eventBanners } from "../data/mock"

export function PromoBannerCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % eventBanners.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + eventBanners.length) % eventBanners.length)
  }, [])

  // Auto-scroll (3초 간격, 모바일 앱과 동일)
  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {eventBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="relative w-full shrink-0 aspect-[3/1] md:aspect-[4/1]"
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <p className="text-white font-bold text-lg md:text-xl drop-shadow-lg">
                {banner.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full",
          "bg-black/30 text-white backdrop-blur-sm",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-black/50"
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={next}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full",
          "bg-black/30 text-white backdrop-blur-sm",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-black/50"
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1.5">
        {eventBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "size-2 rounded-full transition-all",
              index === current ? "bg-white w-5" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
