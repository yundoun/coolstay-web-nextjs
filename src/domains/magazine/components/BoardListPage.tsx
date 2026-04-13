"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Section } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useBoardList } from "../hooks/useMagazine"
import type { BoardType, BoardSummary } from "../types"

const TABS: { value: BoardType; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "VIDEO", label: "영상" },
  { value: "COLUMN", label: "칼럼" },
  { value: "REVIEW_DINING", label: "맛집 후기" },
]

export function BoardListPage() {
  const [activeTab, setActiveTab] = useState<BoardType>("ALL")
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBoardList(activeTab)

  const boards = data?.pages.flatMap((p) => p.boards) ?? []
  const totalCount = data?.pages[0]?.total_count ?? 0

  return (
    <main>
      <Section spacing="md">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/magazine" className="rounded-full p-1.5 hover:bg-accent transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">게시글</h1>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground">{totalCount}개의 글</p>
            )}
          </div>
        </div>

        {/* 타입 필터 탭 */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 게시글 리스트 */}
        {isLoading ? (
          <BoardListSkeleton />
        ) : boards.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            게시글이 없습니다
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <BoardCard key={board.key} board={board} showType={activeTab === "ALL"} />
              ))}
            </div>
            {hasNextPage && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "불러오는 중..." : "더보기"}
                </Button>
              </div>
            )}
          </>
        )}
      </Section>
    </main>
  )
}

function BoardCard({ board, showType }: { board: BoardSummary; showType: boolean }) {
  const isVideo = board.type === "영상" || board.link?.target

  return (
    <Link
      href={isVideo && board.link?.target ? board.link.target : `/magazine/board/${board.key}`}
      target={isVideo ? "_blank" : undefined}
      rel={isVideo ? "noopener noreferrer" : undefined}
      className={cn(
        "group rounded-xl overflow-hidden border bg-card",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {board.thumbnail_url ? (
          <Image
            src={board.thumbnail_url}
            alt={board.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
        {showType && board.type && (
          <Badge
            variant="secondary"
            className="absolute top-2.5 left-2.5 bg-black/50 text-white border-none text-[10px]"
          >
            {board.type}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {board.title}
        </h3>
        {board.sub_title && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {board.sub_title}
          </p>
        )}
      </div>
    </Link>
  )
}

function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <Skeleton className="aspect-[16/10]" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
