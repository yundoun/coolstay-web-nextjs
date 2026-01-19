"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { curationItems, type CurationItem } from "../data/mock"

export function BentoGrid() {
  return (
    <div
      data-slot="bento-grid"
      className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4"
    >
      {curationItems.map((item, index) => (
        <BentoCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}

interface BentoCardProps {
  item: CurationItem
  index: number
}

function BentoCard({ item, index }: BentoCardProps) {
  // Bento grid layout mapping
  const layoutClasses = {
    large: "col-span-2 row-span-2", // 2x2
    wide: "col-span-2 row-span-1",  // 2x1
    tall: "col-span-1 row-span-2",  // 1x2
    small: "col-span-1 row-span-1", // 1x1
  }

  // Height mapping based on size
  const heightClasses = {
    large: "min-h-[300px] md:min-h-[400px]",
    wide: "min-h-[150px] md:min-h-[190px]",
    tall: "min-h-[300px] md:min-h-[400px]",
    small: "min-h-[150px] md:min-h-[190px]",
  }

  return (
    <Link
      href={item.link}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "transition-transform duration-300 hover:scale-[1.02]",
        layoutClasses[item.size],
        heightClasses[item.size]
      )}
    >
      {/* Background Image */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={
          item.size === "large"
            ? "(max-width: 768px) 100vw, 50vw"
            : item.size === "wide"
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 50vw, 25vw"
        }
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {item.subtitle && (
          <p className="text-xs text-white/80 md:text-sm">{item.subtitle}</p>
        )}
        <h3
          className={cn(
            "font-semibold text-white",
            item.size === "large" ? "text-xl md:text-2xl" : "text-base md:text-lg"
          )}
        >
          {item.title}
        </h3>
      </div>

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-primary/10",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        )}
      />
    </Link>
  )
}
