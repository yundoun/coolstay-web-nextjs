"use client"

import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useMagazineHome } from "@/domains/magazine/hooks/useMagazine"

const SUB_TYPE_LABEL: Record<string, string> = {
  VIDEO: "영상",
  COLUMN: "칼럼",
  REVIEW_DINING: "맛집 후기",
}

export function MagazineSection() {
  const { data, isLoading } = useMagazineHome()

  if (isLoading) return <MagazineSkeleton />

  const videos = data?.magazine_video ?? []
  const boards = data?.magazine_board ?? []
  const hasContent = videos.length > 0 || boards.length > 0

  if (!hasContent) return null

  return (
    <div className="space-y-6">
      {/* 영상 (가로 스크롤) */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">영상</h3>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {videos.slice(0, 6).map((video) => (
              <button
                key={video.key}
                onClick={() => video.link?.target && window.open(video.link.target, "_blank", "noopener,noreferrer")}
                className="group relative flex-shrink-0 w-[180px] rounded-xl overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={`영상 ${video.key}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="180px"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="rounded-full bg-white/90 p-2">
                      <Play className="size-4 text-primary fill-primary" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 게시글 (그리드) */}
      {boards.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">게시글</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {boards.slice(0, 6).map((board) => (
              <Link
                key={board.key}
                href={board.sub_type === "VIDEO" && board.link?.target
                  ? board.link.target
                  : `/magazine/board/${board.key}`}
                target={board.sub_type === "VIDEO" ? "_blank" : undefined}
                rel={board.sub_type === "VIDEO" ? "noopener noreferrer" : undefined}
                className={cn(
                  "group rounded-xl overflow-hidden border bg-card",
                  "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {board.thumbnail_url ? (
                    <Image
                      src={board.thumbnail_url}
                      alt={`게시글 ${board.key}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  {board.sub_type && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-black/50 text-white border-none text-[10px]"
                    >
                      {SUB_TYPE_LABEL[board.sub_type] ?? board.sub_type}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 더보기 */}
      <div className="text-center">
        <Link
          href="/magazine"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          매거진 전체보기 →
        </Link>
      </div>
    </div>
  )
}

function MagazineSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-[180px] flex-shrink-0 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    </div>
  )
}
