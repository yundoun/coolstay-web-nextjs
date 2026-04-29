"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MagazineCardSkeleton } from "@/components/skeleton"
import { cn } from "@/lib/utils"
import { useMagazineHome } from "@/domains/magazine/hooks/useMagazine"

export function MagazineSection() {
  const { data, isLoading } = useMagazineHome()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })

  if (isLoading) return <MagazineSkeleton />

  const allItems = [
    ...(data?.magazine_video ?? []).map((v) => ({ ...v, _type: "video" as const })),
    ...(data?.magazine_board ?? []).map((b) => ({ ...b, _type: "board" as const })),
  ]

  if (allItems.length === 0) return null

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
        {allItems.map((item) => {
          const image = item.thumbnail_url
          const href = item._type === "video" && item.link?.target
            ? item.link.target
            : `/magazine/board/${item.key}`

          return (
            <Link
              key={`${item._type}-${item.key}`}
              href={href}
              target={item._type === "video" ? "_blank" : undefined}
              rel={item._type === "video" ? "noopener noreferrer" : undefined}
              className={cn(
                "relative shrink-0 w-[200px] rounded-xl overflow-hidden aspect-[3/4]",
                isDragging && "pointer-events-none"
              )}
              draggable={false}
            >
              {image ? (
                <Image
                  src={image}
                  alt={`매거진 ${item.key}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                  draggable={false}
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  이미지 없음
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
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
