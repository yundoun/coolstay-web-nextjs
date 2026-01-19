"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { popularRegions } from "../data/mock"
import { useRef } from "react"

export function RegionCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 300
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  return (
    <div data-slot="region-carousel" className="relative">
      {/* Navigation Buttons - Hidden on mobile */}
      <div className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full bg-card shadow-lg"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">이전</span>
        </Button>
      </div>
      <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full bg-card shadow-lg"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="size-5" />
          <span className="sr-only">다음</span>
        </Button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-3 overflow-x-auto md:gap-4",
          "scrollbar-hide snap-x-mandatory",
          "-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-10 lg:px-10"
        )}
      >
        {popularRegions.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  )
}

interface RegionCardProps {
  region: (typeof popularRegions)[number]
}

function RegionCard({ region }: RegionCardProps) {
  return (
    <Link
      href={`/search?region=${region.name}`}
      className={cn(
        "group flex-shrink-0 snap-start",
        "w-[70%] sm:w-[45%] md:w-[33%] lg:w-[20%]"
      )}
    >
      <div className="overflow-hidden rounded-xl">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={region.imageUrl}
            alt={region.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        {/* Info */}
        <div className="pt-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {region.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            숙소 {region.accommodationCount.toLocaleString()}개
          </p>
        </div>
      </div>
    </Link>
  )
}
