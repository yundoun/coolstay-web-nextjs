"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { Section } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { usePackageList } from "../hooks/useMagazine"
import type { BoardItem } from "../types"

export function PackageListPage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePackageList()

  const packages = data?.pages.flatMap((p) => p.board_items) ?? []
  const totalCount = data?.pages[0]?.total_count ?? 0

  return (
    <main>
      <Section spacing="md">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/magazine" className="rounded-full p-1.5 hover:bg-accent transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">패키지</h1>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground">{totalCount}개의 패키지</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <PackageListSkeleton />
        ) : packages.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            패키지가 없습니다
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <PackageCard key={pkg.key} item={pkg} />
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

function PackageCard({ item }: { item: BoardItem }) {
  const imageUrl = item.image_urls?.[0] ?? item.banner_image_url
  const isClosed = item.end_dt ? item.end_dt * 1000 < Date.now() : false

  function formatDate(ts?: number) {
    if (!ts) return ""
    return new Date(ts * 1000).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <Link
      href={`/magazine/package/${item.key}`}
      className={cn(
        "group rounded-xl overflow-hidden border bg-card",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        isClosed && "opacity-60"
      )}
    >
      <div className="relative aspect-[2/1] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5" />
        )}
        {isClosed && (
          <Badge className="absolute top-2.5 left-2.5 bg-muted-foreground text-white border-none">
            마감
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.thumb_description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {item.thumb_description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.start_dt && item.end_dt && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDate(item.start_dt)} ~ {formatDate(item.end_dt)}
            </span>
          )}
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                <Tag className="size-2.5 mr-0.5" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function PackageListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <Skeleton className="aspect-[2/1]" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
