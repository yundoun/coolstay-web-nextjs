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

  // 첫 번째는 크게, 나머지는 그리드
  const hero = items[0]
  const rest = items.slice(1)

  return (
    <div>
      {/* 전체보기 */}
      <div className="flex justify-end mb-4">
        <Link
          href="/exhibitions"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          전체보기
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 히어로 카드 */}
      <Link
        href={`/exhibitions/${hero.key}?type=${hero.type || "EXHIBITION"}`}
        className="group relative overflow-hidden rounded-xl block aspect-[2/1] mb-3"
      >
        {(hero.banner_image_url || hero.image_urls?.[0]) ? (
          <Image
            src={(hero.banner_image_url || hero.image_urls?.[0])!}
            alt={hero.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          {hero.thumb_description && (
            <p className="text-xs text-white/70 mb-1">{hero.thumb_description}</p>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold text-white">
              {hero.title}
            </h3>
            <ArrowRight className="size-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* 나머지 그리드 */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {rest.map((item) => (
            <Link
              key={item.key}
              href={`/exhibitions/${item.key}?type=${item.type || "EXHIBITION"}`}
              className="group relative overflow-hidden rounded-xl aspect-[4/3]"
            >
              {(item.banner_image_url || item.image_urls?.[0]) ? (
                <Image
                  src={(item.banner_image_url || item.image_urls?.[0])!}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {item.thumb_description && (
                  <p className="text-[10px] text-white/60 mb-0.5 line-clamp-1">
                    {item.thumb_description}
                  </p>
                )}
                <h4 className="text-sm font-semibold text-white line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
