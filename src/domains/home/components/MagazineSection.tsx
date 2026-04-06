"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AiMagazineBanner } from "@/lib/api/types"

interface Props {
  magazines?: AiMagazineBanner[]
}

export function MagazineSection({ magazines }: Props) {
  const items = magazines?.length ? magazines : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.key}
          href={`/magazine/${item.key}`}
          className={cn(
            "group rounded-xl overflow-hidden border bg-card",
            "transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1"
          )}
        >
          {item.image_url && (
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title ?? `매거진 ${item.key}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
