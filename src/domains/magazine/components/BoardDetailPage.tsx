"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Section } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { useBoardDetail } from "../hooks/useMagazine"
import type { StoreItem } from "@/lib/api/types"

interface Props {
  boardKey: number
}

export function BoardDetailPage({ boardKey }: Props) {
  const { data, isLoading } = useBoardDetail(boardKey)
  const detail = data?.board_detail

  if (isLoading) return <BoardDetailSkeleton />
  if (!detail) {
    return (
      <Section spacing="md">
        <div className="py-20 text-center text-muted-foreground">
          게시글을 찾을 수 없습니다
        </div>
      </Section>
    )
  }

  return (
    <main>
      <Section spacing="md">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/magazine/board" className="rounded-full p-1.5 hover:bg-accent transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-bold line-clamp-1">{detail.title}</h1>
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
          {detail.profile_image_url ? (
            <Image
              src={detail.profile_image_url}
              alt={detail.writer_name ?? "작성자"}
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <User className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{detail.writer_name ?? "작성자"}</p>
            {detail.writer_introduction && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {detail.writer_introduction}
              </p>
            )}
          </div>
          {detail.post_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              {detail.post_date}
            </div>
          )}
        </div>

        {/* 부제목 */}
        {detail.sub_title && (
          <p className="mb-6 text-lg text-muted-foreground">{detail.sub_title}</p>
        )}

        {/* HTML 본문 */}
        {detail.description && (
          <article
            className="prose prose-sm sm:prose max-w-none dark:prose-invert
              prose-img:rounded-xl prose-img:w-full
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: detail.description }}
          />
        )}
      </Section>

      {/* 패키지 배너 */}
      {detail.package_banner?.banner_image_url && detail.package_banner?.package_key && (
        <Section spacing="md">
          <Link
            href={`/magazine/package/${detail.package_banner.package_key}`}
            className="block rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[3/1]">
              <Image
                src={detail.package_banner.banner_image_url}
                alt="패키지 배너"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </Link>
        </Section>
      )}

      {/* 추천 숙소 */}
      {detail.motels && detail.motels.length > 0 && (
        <Section
          title="추천 숙소"
          description="이 게시글과 함께 보면 좋은 숙소"
          spacing="md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {detail.motels.map((store) => (
              <RecommendStoreCard key={store.key} store={store} />
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}

function RecommendStoreCard({ store }: { store: StoreItem }) {
  const image = store.images?.[0]
  const firstItem = store.items?.[0]

  return (
    <Link
      href={`/accommodation/${store.key}`}
      className="group flex gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-md"
    >
      <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg">
        {image?.url ? (
          <Image
            src={image.thumb_url || image.url}
            alt={store.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {store.name}
        </h4>
        {store.rating && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            ★ {store.rating.avg_score} ({store.rating.review_count})
          </p>
        )}
        {firstItem && (
          <p className="mt-1 text-sm font-medium text-primary">
            {firstItem.discount_price?.toLocaleString()}원~
          </p>
        )}
      </div>
    </Link>
  )
}

function BoardDetailSkeleton() {
  return (
    <Section spacing="md">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex items-center gap-3 mb-6 pb-6 border-b">
        <Skeleton className="size-11 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </Section>
  )
}
