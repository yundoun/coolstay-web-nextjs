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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {boards.map((board) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
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
