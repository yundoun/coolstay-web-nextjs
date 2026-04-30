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
  const dragState = useRef({ startX: 0, scrollLeft: 0, isDown: false })

  if (isLoading) return <MagazineSkeleton />

  const banners = data?.magazine_banner ?? []
  if (banners.length === 0) return null

  const DRAG_THRESHOLD = 5

  const onMouseDown = (e: React.MouseEvent) => {
    console.log("[Magazine] mouseDown", { pageX: e.pageX, isDragging })
    dragState.current = { startX: e.pageX, scrollLeft: scrollRef.current?.scrollLeft ?? 0, isDown: true }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !scrollRef.current) return
    const dx = e.pageX - dragState.current.startX
    if (!isDragging && Math.abs(dx) > DRAG_THRESHOLD) {
      console.log("[Magazine] drag started", { dx })
      setIsDragging(true)
    }
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      e.preventDefault()
      scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx
    }
  }
  const onMouseUp = () => {
    console.log("[Magazine] mouseUp", { isDragging, isDown: dragState.current.isDown })
    dragState.current.isDown = false
    setIsDragging(false)
  }

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

  console.log("[Magazine] BannerCard render", {
    key: banner.key,
    href,
    isDragging,
    linkType: banner.link?.type,
    subType: banner.link?.sub_type,
    target: banner.link?.target,
  })

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
      onClick={(e) => {
        console.log("[Magazine] Link clicked!", {
          key: banner.key,
          href,
          isDragging,
          defaultPrevented: e.defaultPrevented,
          pointerEvents: (e.currentTarget as HTMLElement).style.pointerEvents,
          classList: (e.currentTarget as HTMLElement).className,
        })
      }}
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
