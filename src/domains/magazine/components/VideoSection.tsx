"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MagazineVideo } from "../types"

interface Props {
  videos: MagazineVideo[]
}

export function VideoSection({ videos }: Props) {
  if (videos.length === 0) return null

  function handleClick(video: MagazineVideo) {
    if (video.link?.target) {
      window.open(video.link.target, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {videos.map((video) => (
        <button
          key={video.key}
          onClick={() => handleClick(video)}
          className={cn(
            "group relative flex-shrink-0 w-[200px] sm:w-[240px] rounded-xl overflow-hidden",
            "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          )}
        >
          <div className="relative aspect-[16/9]">
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={`영상 ${video.key}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="240px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="rounded-full bg-white/90 p-2.5 shadow-lg">
                <Play className="size-5 text-primary fill-primary" />
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
