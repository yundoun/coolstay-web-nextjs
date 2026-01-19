"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Utensils, Coffee, Camera, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getLocalCuration } from "../data/localCuration"
import type { LocalCurationItem } from "../types"

interface LocalCurationSectionProps {
  region?: string
}

export function LocalCurationSection({ region }: LocalCurationSectionProps) {
  const curation = getLocalCuration(region)

  return (
    <section className="py-8 md:py-12">
      {/* Header - Design System Section Header */}
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
            {curation.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            여행이 더 특별해지는 현지 추천 스팟
          </p>
        </div>
        <Link
          href={`/local/${region || "all"}`}
          className={cn(
            "hidden md:flex items-center gap-1.5",
            "text-sm font-medium text-primary",
            "hover:underline underline-offset-4"
          )}
        >
          더보기
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {curation.items.map((item) => (
          <LocalCurationCard key={item.id} item={item} />
        ))}
      </div>

      {/* Mobile More Link */}
      <Link
        href={`/local/${region || "all"}`}
        className={cn(
          "flex md:hidden items-center justify-center gap-1.5 mt-6",
          "text-sm font-medium text-primary",
          "hover:underline underline-offset-4"
        )}
      >
        더 많은 로컬 스팟 보기
        <ArrowRight className="size-4" />
      </Link>
    </section>
  )
}

interface LocalCurationCardProps {
  item: LocalCurationItem
}

function LocalCurationCard({ item }: LocalCurationCardProps) {
  const TypeIcon = {
    restaurant: Utensils,
    cafe: Coffee,
    spot: Camera,
    activity: MapPin,
  }[item.type]

  const typeLabel = {
    restaurant: "맛집",
    cafe: "카페",
    spot: "명소",
    activity: "액티비티",
  }[item.type]

  return (
    <Link
      href={`/local/spot/${item.id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-card border border-border/50",
        "transition-all duration-300",
        "hover:shadow-xl hover:border-border",
        "hover:-translate-y-1"
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative shrink-0 size-24 md:size-28 overflow-hidden rounded-xl">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-500",
              "group-hover:scale-110"
            )}
            sizes="(max-width: 768px) 96px, 112px"
          />
          {/* Glass Type Badge */}
          <div
            className={cn(
              "absolute bottom-1.5 left-1.5",
              "flex items-center gap-1 px-2 py-0.5 rounded-full",
              "bg-black/60 backdrop-blur-sm",
              "text-xs font-medium text-white"
            )}
          >
            <TypeIcon className="size-3" />
            {typeLabel}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <h3
            className={cn(
              "font-semibold text-foreground line-clamp-1",
              "group-hover:text-primary transition-colors"
            )}
          >
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          {item.distance && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {item.distance}
            </div>
          )}
        </div>
      </div>

      {/* Hover Gradient */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-gradient-to-r from-primary/5 to-transparent",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
      />
    </Link>
  )
}
