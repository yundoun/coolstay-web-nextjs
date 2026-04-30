"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MagazineCardSkeleton } from "@/components/skeleton"
import { cn } from "@/lib/utils"
import { useMagazineHome } from "@/domains/magazine/hooks/useMagazine"
import type { MagazineBanner } from "@/domains/magazine/types"

export function MagazineSection() {
  const { data, isLoading } = useMagazineHome()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })

  if (isLoading) return <MagazineSkeleton />

  const banners = data?.magazine_banner ?? []
  if (banners.length === 0) return null

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
        {banners.map((banner) => (
          <BannerCard
            key={banner.key}
            banner={banner}
            isDragging={isDragging}
          />
        ))}
      </div>
    </div>
  )
}

function BannerCard({ banner, isDragging }: { banner: MagazineBanner; isDragging: boolean }) {
  const href = resolveBannerLink(banner)
  const isExternal = href.startsWith("http")

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "relative shrink-0 w-[220px] rounded-xl overflow-hidden aspect-[3/4]",
        isDragging && "pointer-events-none"
      )}
      draggable={false}
    >
      {banner.image_url ? (
        <Image
          src={banner.image_url}
          alt={`매거진 배너 ${banner.key}`}
          fill
          className="object-cover"
          sizes="220px"
          draggable={false}
        />
      ) : (
        <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
          이미지 없음
        </div>
      )}
    </Link>
  )
}

/** AOS link 타입 → 웹 경로 변환 */
function resolveBannerLink(banner: MagazineBanner): string {
  const link = banner.link
  if (!link) return "/magazine"

  if (link.type === "APP_LINK") {
    if (link.sub_type === "A_MG_05" && link.target) {
      return `/magazine/board/${link.target}`
    }
    return "/magazine"
  }

  if (link.type === "URL" && link.target) {
    return link.target
  }

  return "/magazine"
}

function MagazineSkeleton() {
  return (
    <div className="section-px">
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <MagazineCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
