"use client"

import { Star, ChevronRight, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
  const maxCount = Math.max(...Object.values(reviews.ratingDistribution))

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-lg font-semibold">
          리뷰{" "}
          <span className="text-muted-foreground font-normal">
            ({reviews.totalCount.toLocaleString()})
          </span>
        </h2>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
          <Link href={`/accommodations/${accommodationId}/reviews`}>
            전체보기
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="flex gap-8 items-center p-6 rounded-2xl bg-muted/50 mb-6">
        <div className="text-center shrink-0">
          <div className="text-4xl font-bold">{reviews.averageRating}</div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-4",
                  star <= Math.round(reviews.averageRating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {reviews.totalCount.toLocaleString()}개 리뷰
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.ratingDistribution[rating] || 0
            const width = maxCount > 0 ? (count / maxCount) * 100 : 0
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-3 text-right">{rating}</span>
                <Star className="size-3 fill-primary text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 베스트 리뷰 하이라이트 */}
      {bestReview && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="size-4 text-primary" />
            <span className="text-sm font-semibold text-primary">베스트 리뷰</span>
          </div>
          <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
            <ReviewCard review={bestReview} />
          </div>
        </div>
      )}

      {/* 최근 리뷰 */}
      {recentReviews.length > 0 && (
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl border bg-card">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{review.userName}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-3",
                  star <= review.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{review.createdAt}</span>
      </div>

      <p className="text-xs text-muted-foreground mb-2">{review.roomName}</p>
      <p className="text-sm leading-relaxed">{review.content}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((image, index) => (
            <div key={index} className="relative size-20 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`리뷰 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}

      {review.reply && (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
          <p className="text-xs font-medium mb-1">숙소 답변</p>
          <p className="text-xs text-muted-foreground">{review.reply.content}</p>
        </div>
      )}
    </div>
  )
}
