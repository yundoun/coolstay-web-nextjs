"use client"

import { Star, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── 별점 ───────────────────────────────────────────────────

export function InlineStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "size-3.5" : "size-3"
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            cls,
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  )
}

// ─── BEST 뱃지 ──────────────────────────────────────────────

export function BestBadge({ variant = "inline" }: { variant?: "inline" | "overlay" }) {
  if (variant === "overlay") {
    return (
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-950 text-[11px] font-bold backdrop-blur-sm">
        BEST
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-semibold border border-amber-200/60 dark:border-amber-700/40">
      BEST
    </span>
  )
}

// ─── 사장님 답변 ────────────────────────────────────────────

export function OwnerReply({ content, createdAt }: { content: string; createdAt?: string }) {
  return (
    <div className="mt-3 flex gap-2.5 p-3 rounded-xl bg-muted/50">
      <MessageSquare className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground mb-0.5">사장님 답변</p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

// ─── 리뷰 카드 컨테이너 ─────────────────────────────────────

export function ReviewCardContainer({
  isBest,
  className,
  children,
}: {
  isBest?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border",
        isBest
          ? "border-amber-300/60 dark:border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10"
          : "bg-card border-border",
        className,
      )}
    >
      {children}
    </div>
  )
}
