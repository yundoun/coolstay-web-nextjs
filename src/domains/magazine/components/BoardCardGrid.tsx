"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MagazineBoard } from "../types"

interface Props {
  boards: MagazineBoard[]
  /** 더보기 숨김 (홈에서 사용 시) */
  hideMore?: boolean
}

const SUB_TYPE_LABEL: Record<string, string> = {
  VIDEO: "영상",
  COLUMN: "칼럼",
  REVIEW_DINING: "맛집 후기",
}

export function BoardCardGrid({ boards, hideMore }: Props) {
  if (boards.length === 0) return null

  return (
    <div>
      <div className="flex gap-[15px] overflow-x-auto px-4 pb-1 scrollbar-hide">
        {boards.map((board) => (
          <Link
            key={board.key}
            href={board.sub_type === "VIDEO" && board.link?.target
              ? board.link.target
              : `/magazine/board/${board.key}`}
            target={board.sub_type === "VIDEO" ? "_blank" : undefined}
            rel={board.sub_type === "VIDEO" ? "noopener noreferrer" : undefined}
            className={cn(
              "group relative flex-shrink-0 w-[280px] rounded-2xl overflow-hidden",
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
                  sizes="280px"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
              )}
              {/* 하단 그라데이션 + 타입 태그 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-10 pb-3 px-3">
                {board.sub_type && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-none text-[10px] backdrop-blur-sm"
                  >
                    {SUB_TYPE_LABEL[board.sub_type] ?? board.sub_type}
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!hideMore && (
        <div className="mt-4 text-center">
          <Link
            href="/magazine/board"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            게시글 전체보기 →
          </Link>
        </div>
      )}
    </div>
  )
}
