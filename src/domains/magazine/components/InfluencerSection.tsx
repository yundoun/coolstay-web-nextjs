"use client"

import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MagazineVideo } from "../types"

interface Props {
  videos: MagazineVideo[]
}

export function InfluencerSection({ videos }: Props) {
  if (videos.length === 0) return null

  function handleClick(video: MagazineVideo) {
    if (video.link?.target) {
      window.open(video.link.target, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div>
      {/* 수평 스크롤 카드 */}
      <div className="flex gap-[15px] overflow-x-auto px-4 pb-3 scrollbar-hide">
        {videos.map((video) => (
          <button
            key={video.key}
            onClick={() => handleClick(video)}
            className={cn(
              "group relative flex-shrink-0 w-[322px] rounded-2xl overflow-hidden",
              "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            <div className="relative aspect-video">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={`인플루언서 영상 ${video.key}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="322px"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="rounded-full bg-white/90 p-3 shadow-lg">
                  <Play className="size-6 text-primary fill-primary" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA 버튼 */}
      <div className="px-4">
        <Link
          href="/magazine/board?type=VIDEO"
          className="flex items-center justify-center w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90"
        >
          AI 인플루언서 영상 전체보기
        </Link>
      </div>
    </div>
  )
}
