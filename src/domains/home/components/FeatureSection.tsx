"use client"

import Image from "next/image"
import Link from "next/link"
import type { Exhibition } from "@/lib/api/types"

interface Props {
  exhibitions?: Exhibition[]
}

export function FeatureSection({ exhibitions }: Props) {
  const items = exhibitions?.length ? exhibitions : []
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-3 section-px">
      {items.map((item) => (
        <Link
          key={item.key}
          href={`/exhibitions/${item.key}?type=${item.type || "EXHIBITION"}`}
          className="relative block rounded-xl overflow-hidden h-[200px]"
        >
          {(item.banner_image_url || item.image_urls?.[0]) ? (
            <Image
              src={(item.banner_image_url || item.image_urls?.[0])!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {item.thumb_description && (
              <p className="text-xs text-white/70 mb-0.5 line-clamp-1">
                {item.thumb_description}
              </p>
            )}
            <h4 className="text-sm font-bold text-white line-clamp-1">
              {item.title}
            </h4>
          </div>
        </Link>
      ))}
    </div>
  )
}
