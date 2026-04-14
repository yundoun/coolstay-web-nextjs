"use client"

import { useState, useRef } from "react"
import { Star, ChevronRight, ChevronLeft, Quote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { cn } from "@/lib/utils"
import { InlineStars, BestBadge, OwnerReply, ReviewCardContainer } from "./ReviewCardParts"
import type { ReviewSummary, Review } from "../types"

interface ReviewSectionProps {
  reviews: ReviewSummary
  bestReview: Review | null
  recentReviews: Review[]
  accommodationId: string
}

export function ReviewSection({
  reviews,
  bestReview,
  recentReviews,
  accommodationId,
}: ReviewSectionProps) {
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // 베스트 + 최근 리뷰 통합 (중복 제거)
  const allReviews: { review: Review; isBest: boolean }[] = []
  if (bestReview) allReviews.push({ review: bestReview, isBest: true })
  for (const r of recentReviews) {
    if (!bestReview || r.id !== bestReview.id) {
      allReviews.push({ review: r, isBest: false })
    }
  }

  return (
    <>
      <div>
        {/* 헤더 */}
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl font-semibold">리뷰</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
            <Link href={`/accommodations/${accommodationId}/reviews`}>
              전체보기
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* 평점 요약 */}
        <RatingSummary reviews={reviews} />

        {/* 리뷰 캐러셀 */}
        {allReviews.length > 0 && (
          <div className="mt-5">
            <ReviewCarousel reviews={allReviews} onImageClick={openLightbox} />
          </div>
        )}
      </div>

      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          alt="리뷰 이미지"
        />
      )}
    </>
  )
}

// ─── 평점 요약 ──────────────────────────────────────────────

function RatingSummary({ reviews }: { reviews: ReviewSummary }) {
  const maxCount = Math.max(...Object.values(reviews.ratingDistribution), 1)

  return (
    <div className="flex gap-6 items-center p-5 rounded-2xl bg-muted/40 border">
      {/* 좌측: 평균 점수 */}
      <div className="text-center shrink-0 px-2">
        <div className="text-4xl font-bold tracking-tight">{reviews.averageRating}</div>
        <div className="flex items-center justify-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "size-3.5",
                star <= Math.round(reviews.averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {reviews.totalCount.toLocaleString()}개
        </p>
      </div>

      {/* 우측: 분포 그래프 */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviews.ratingDistribution[rating] || 0
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

// ─── 리뷰 캐러셀 ────────────────────────────────────────────

function ReviewCarousel({
  reviews,
  onImageClick,
}: {
  reviews: { review: Review; isBest: boolean }[]
  onImageClick: (images: string[], index: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  return (
    <div className="relative group">
      {/* 좌우 화살표 (PC hover) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 size-9 items-center justify-center rounded-full bg-background border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-9 items-center justify-center rounded-full bg-background border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
        >
          <ChevronRight className="size-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {reviews.map(({ review, isBest }) => {
          const hasImages = review.images && review.images.filter(Boolean).length > 0
          return hasImages ? (
            <ImageReviewCard
              key={review.id}
              review={review}
              isBest={isBest}
              onImageClick={onImageClick}
            />
          ) : (
            <TextReviewCard key={review.id} review={review} isBest={isBest} />
          )
        })}
      </div>
    </div>
  )
}

// ─── 이미지 리뷰 카드 ───────────────────────────────────────

function ImageReviewCard({
  review,
  isBest,
  onImageClick,
}: {
  review: Review
  isBest: boolean
  onImageClick: (images: string[], index: number) => void
}) {
  const validImages = (review.images || []).filter(Boolean)

  return (
    <ReviewCardContainer
      isBest={isBest}
      className="shrink-0 w-[280px] md:w-[320px] snap-start overflow-hidden"
    >
      {/* 이미지 영역 */}
      <div className="relative h-[140px] bg-muted">
        <button
          className="absolute inset-0"
          onClick={() => onImageClick(validImages, 0)}
        >
          <Image
            src={validImages[0]}
            alt="리뷰 이미지"
            fill
            className="object-cover"
            sizes="320px"
          />
        </button>
        {validImages.length > 1 && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium">
            +{validImages.length - 1}
          </span>
        )}
        {isBest && <BestBadge variant="overlay" />}
      </div>

      {/* 본문 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <InlineStars rating={review.rating} />
            <span className="text-sm font-semibold">{review.userName}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{review.createdAt}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-1.5">{review.roomName}</p>
        <p className="text-[13px] leading-relaxed line-clamp-2">{review.content}</p>

        {review.reply && (
          <OwnerReply content={review.reply.content} createdAt={review.reply.createdAt} />
        )}
      </div>
    </ReviewCardContainer>
  )
}

// ─── 텍스트 리뷰 카드 ───────────────────────────────────────

function TextReviewCard({
  review,
  isBest,
}: {
  review: Review
  isBest: boolean
}) {
  return (
    <ReviewCardContainer
      isBest={isBest}
      className="shrink-0 w-[280px] md:w-[320px] snap-start p-4 flex flex-col"
    >
      {isBest && (
        <div className="mb-3">
          <BestBadge />
        </div>
      )}

      {/* 인용 아이콘 */}
      <Quote className="size-5 text-muted-foreground/25 mb-2 shrink-0" />

      {/* 본문 */}
      <p className="text-[13px] leading-relaxed line-clamp-4 flex-1">{review.content}</p>

      {/* 작성자 정보 */}
      <div className="mt-3 pt-3 border-t border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <InlineStars rating={review.rating} />
            <span className="text-sm font-semibold">{review.userName}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{review.createdAt}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{review.roomName}</p>
      </div>

      {review.reply && (
        <OwnerReply content={review.reply.content} createdAt={review.reply.createdAt} />
      )}
    </ReviewCardContainer>
  )
}
