"use client"

import { useState, useMemo } from "react"
import { Star, Quote, MapPin, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { useStoreDetail } from "../hooks/useDetailData"
import { mapMotelToDetail } from "../utils/mapMotelToDetail"
import { useStoreReviews } from "@/domains/review/hooks/useReviewData"
import { mapApiReviewToDisplay } from "@/domains/review/utils/mapReviewToDisplay"
import { InlineStars, BestBadge, OwnerReply, ReviewCardContainer } from "./ReviewCardParts"
import type { Review } from "../types"

interface Props {
  accommodationId: string
}

type SortType = "latest" | "highest" | "lowest"

export function AccommodationReviewsPage({ accommodationId }: Props) {
  const [sort, setSort] = useState<SortType>("latest")
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // 헤더 정보용 (숙소명, 이미지, 주소)
  const { data: storeData, isLoading: isStoreLoading } = useStoreDetail(accommodationId)
  // 리뷰 전용 API (커서 기반 무한 스크롤)
  const {
    data: reviewPages,
    isLoading: isReviewLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useStoreReviews(accommodationId)

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const isLoading = isStoreLoading || isReviewLoading

  if (isLoading) return <LoadingSpinner fullPage />

  const detail = storeData?.motel ? mapMotelToDetail(storeData.motel) : null

  // 리뷰 데이터: 전용 API에서 가져옴
  const firstPage = reviewPages?.pages[0]
  const avgScore = firstPage?.avg_score ? parseFloat(firstPage.avg_score) : 0
  const totalCount = firstPage?.total_count ?? 0

  const allReviews: Review[] = useMemo(() => {
    if (!reviewPages?.pages) return []
    return reviewPages.pages.flatMap((page) =>
      (page.reviews ?? []).map(mapApiReviewToDisplay)
    )
  }, [reviewPages])

  // 클라이언트 정렬 (API에 sort 파라미터 없음)
  const sorted = useMemo(() => {
    const arr = [...allReviews]
    if (sort === "highest") return arr.sort((a, b) => b.rating - a.rating)
    if (sort === "lowest") return arr.sort((a, b) => a.rating - b.rating)
    return arr // latest — API 기본 순서 (REG_DATE_DESC)
  }, [allReviews, sort])

  // 로드된 리뷰에서 평점 분포 근사치 계산
  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of allReviews) {
      const rounded = Math.round(r.rating)
      if (rounded >= 1 && rounded <= 5) dist[rounded]++
    }
    return dist
  }, [allReviews])

  return (
    <Container size="normal" padding="responsive" className="py-6">
      {/* 숙소 정보 헤더 */}
      {detail && (
        <div className="mb-6">
          <div className="flex items-center gap-4">
            {detail.images[0] && (
              <div className="relative size-16 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={detail.images[0]}
                  alt={detail.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">{detail.name}</h1>
              {detail.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate">{detail.address}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 평점 요약 + 분포 */}
      <RatingSummaryBlock
        averageRating={avgScore}
        totalCount={totalCount}
        ratingDistribution={ratingDistribution}
      />

      {/* 정렬 */}
      <div className="flex items-center gap-2 mb-4">
        {(["latest", "highest", "lowest"] as const).map((s) => (
          <Button
            key={s}
            variant={sort === s ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-7"
            onClick={() => setSort(s)}
          >
            {s === "latest" ? "최신순" : s === "highest" ? "평점 높은순" : "평점 낮은순"}
          </Button>
        ))}
      </div>

      {/* 리뷰 리스트 */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Star}
          title="리뷰가 없습니다"
          description="아직 작성된 리뷰가 없습니다."
          className="min-h-[30vh]"
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((review) => (
            <FullReviewCard
              key={review.id}
              review={review}
              onImageClick={openLightbox}
            />
          ))}

          {/* 더보기 */}
          {hasNextPage && (
            <div className="flex justify-center pt-2 pb-4">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    로딩 중...
                  </>
                ) : (
                  "더보기"
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          alt="리뷰 이미지"
        />
      )}
    </Container>
  )
}

// ─── 평점 요약 + 분포 ────────────────────────────────────────

function RatingSummaryBlock({
  averageRating,
  totalCount,
  ratingDistribution,
}: {
  averageRating: number
  totalCount: number
  ratingDistribution: Record<number, number>
}) {
  const maxCount = Math.max(...Object.values(ratingDistribution), 1)

  return (
    <div className="flex gap-6 items-center p-5 rounded-2xl bg-muted/40 border mb-6">
      <div className="text-center shrink-0 px-2">
        <div className="text-4xl font-bold tracking-tight">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "size-3.5",
                star <= Math.round(averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {totalCount.toLocaleString()}개
        </p>
      </div>

      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-2 text-right font-medium">
                {rating}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-5 text-right tabular-nums">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 전체보기용 리뷰 카드 ────────────────────────────────────

function FullReviewCard({
  review,
  onImageClick,
}: {
  review: Review
  onImageClick: (images: string[], index: number) => void
}) {
  const images = (review.images ?? []).filter(Boolean)
  const hasImages = images.length > 0

  return (
    <ReviewCardContainer isBest={review.isBest}>
      {/* 이미지가 있으면 상단에 크게 표시 */}
      {hasImages && (
        <div className="relative">
          {/* 메인 이미지 */}
          <button
            className="relative w-full h-[200px] block"
            onClick={() => onImageClick(images, 0)}
          >
            <Image
              src={images[0]}
              alt="리뷰 이미지"
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </button>

          {/* 추가 이미지 썸네일 */}
          {images.length > 1 && (
            <div className="flex gap-1.5 px-4 -mt-5 relative z-10">
              {images.slice(1, 4).map((img, i) => (
                <button
                  key={i}
                  className="relative size-14 rounded-lg overflow-hidden border-2 border-background shadow-sm hover:ring-2 hover:ring-primary/50 transition-all"
                  onClick={() => onImageClick(images, i + 1)}
                >
                  <Image
                    src={img}
                    alt={`리뷰 이미지 ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
              {images.length > 4 && (
                <button
                  className="size-14 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center justify-center border-2 border-background shadow-sm"
                  onClick={() => onImageClick(images, 4)}
                >
                  +{images.length - 4}
                </button>
              )}
            </div>
          )}

          {review.isBest && <BestBadge variant="overlay" />}
        </div>
      )}

      {/* 본문 영역 */}
      <div className="p-4 pt-3">
        {/* 헤더: 뱃지 + 별점 + 이름 + 날짜 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {review.isBest && !hasImages && <BestBadge />}
            <InlineStars rating={review.rating} size="md" />
            <span className="text-sm font-semibold">{review.userName || "익명"}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{review.createdAt}</span>
        </div>

        {review.roomName && (
          <p className="text-[11px] text-muted-foreground mb-2">{review.roomName}</p>
        )}

        {/* 본문 */}
        {!hasImages && <Quote className="size-4 text-muted-foreground/20 mb-1" />}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.content}</p>

        {/* 사장님 답변 */}
        {review.reply && (
          <OwnerReply content={review.reply.content} createdAt={review.reply.createdAt} />
        )}
      </div>
    </ReviewCardContainer>
  )
}
