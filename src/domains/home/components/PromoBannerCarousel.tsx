"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HomeBanner, LinkItem } from "@/lib/api/types"

/**
 * 배너 link 객체의 sub_type/target을 웹 라우트로 변환한다.
 * - "A_MR_24" → /events/{target} (이벤트 상세)
 * - "A_MR_07" → /exhibitions/{target} (기획전)
 * - "A_CA_03" → /search?type={target} (카테고리)
 * - http(s) URL → 그대로 사용
 * - 그 외 → null (링크 없음)
 */
export function resolveBannerLink(link: LinkItem | undefined | null): string | null {
  if (!link || !link.target) return null

  switch (link.sub_type) {
    case "A_MR_24":
      return `/events/${link.target}`
    case "A_MR_07":
      return `/exhibitions/${link.target}`
    case "A_CA_03":
      return `/search?type=${link.target}`
    default:
      if (link.target.startsWith("http")) return link.target
      return null
  }
}

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
        {items.map((banner) => {
          const href = resolveBannerLink(banner.link)
          const isExternal = href?.startsWith("http")
          const btnName = banner.link?.btn_name

          const content = (
            <>
              <Image
                src={banner.image_urls?.[0] || ""}
                alt={`배너 ${banner.key}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
              {btnName && (
                <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-xs md:text-sm font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  {btnName}
                </span>
              )}
            </>
          )

          if (href && isExternal) {
            return (
              <a
                key={banner.key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full shrink-0 aspect-[3/1] md:aspect-[4/1] block"
              >
                {content}
              </a>
            )
          }

          if (href) {
            return (
              <Link
                key={banner.key}
                href={href}
                className="relative w-full shrink-0 aspect-[3/1] md:aspect-[4/1] block"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={banner.key}
              className="relative w-full shrink-0 aspect-[3/1] md:aspect-[4/1]"
            >
              {content}
            </div>
          )
        })}
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
