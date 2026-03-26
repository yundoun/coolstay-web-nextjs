"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Exhibition } from "@/lib/api/types"

interface Props {
  exhibitions?: Exhibition[]
}

export function FeatureSection({ exhibitions }: Props) {
  const items = exhibitions?.length ? exhibitions : []
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Link
          key={item.key}
          href={`/exhibitions/${item.key}`}
          className={cn(
            "group relative overflow-hidden rounded-xl",
            index === 0 ? "sm:col-span-2 sm:row-span-1" : "",
            "aspect-[16/9]",
            index === 0 && "sm:aspect-[2/1]"
          )}
        >
          <Image
            src={item.banner_image_url || item.image_urls?.[0] || ""}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
            <p className="text-xs text-white/70 mb-1">{item.description}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-white">
                {item.title}
              </h3>
              <ArrowRight className="size-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
