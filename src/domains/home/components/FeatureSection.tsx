"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHomeFilter } from "../hooks/useHomeData"
import { featureItems as mockFeatures } from "../data/mock"
import type { Banner } from "@/lib/api/types"

function apiBannerToFeature(banner: Banner, index: number) {
  return {
    id: String(banner.key),
    title: banner.title || "",
    subtitle: banner.description || banner.thumb_description || "",
    imageUrl: banner.banner_image_url || banner.image_urls?.[0] || "",
    href: banner.webview_link || banner.link?.target || "#",
  }
}

export function FeatureSection() {
  const { data } = useHomeFilter()

  // banners 중 기획전 성격의 배너가 있으면 사용, 없으면 mock
  const features = data?.banners && data.banners.length > 3
    ? data.banners.slice(0, 3).map(apiBannerToFeature)
    : mockFeatures

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((item, index) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "group relative overflow-hidden rounded-xl",
            index === 0 ? "sm:col-span-2 sm:row-span-1" : "",
            "aspect-[16/9]",
            index === 0 && "sm:aspect-[2/1]"
          )}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
            <p className="text-xs text-white/70 mb-1">{item.subtitle}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-white">
                {item.title}
              </h3>
              <ArrowRight className="size-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Link>
      ))}
    </div>
  )
}
