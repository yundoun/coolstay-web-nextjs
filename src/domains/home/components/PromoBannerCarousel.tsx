"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useHomeFilter } from "../hooks/useHomeData"
import { eventBanners as mockBanners } from "../data/mock"
import type { Banner } from "@/lib/api/types"

function apiBannerToLocal(banner: Banner) {
  return {
    id: String(banner.key),
    imageUrl: banner.banner_image_url || banner.image_urls?.[0] || "",
    title: banner.title || "",
    subtitle: banner.description || "",
    link: banner.webview_link || banner.link?.target || "#",
  }
}

export function PromoBannerCarousel() {
  const { data } = useHomeFilter()

  const banners = data?.banners?.length
    ? data.banners.map(apiBannerToLocal)
    : mockBanners

  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

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
        {banners.map((banner) => (
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

      {/* Navigation — Button 컴포넌트 사용 */}
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

      {/* Dots */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1.5">
        {banners.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => setCurrent(index)}
            className={cn(
              "size-2 p-0 min-w-0 h-2 rounded-full transition-all",
              index === current ? "bg-white w-5" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
