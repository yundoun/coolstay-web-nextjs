"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Sparkles,
  ArrowLeft,
  Eye,
  Images,
  Share2,
  Tag,
  Store,
  Ticket,
  Check,
  Download,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { AccommodationCard } from "@/components/accommodation"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { mapStoreToAccommodation } from "@/domains/search/utils/mapStoreToAccommodation"
import { downloadCoupon } from "@/domains/coupon/api/couponApi"
import { COUPON_DOWNLOAD_TYPE } from "@/domains/coupon/types"
import { useAuthStore } from "@/lib/stores/auth"
import { useExhibitionDetail } from "../hooks/useExhibitionDetail"
import type { BoardItem, BoardItemSortTag } from "@/domains/cs/types"
import type { Coupon, StoreItem } from "@/lib/api/types"

// ─── Date-based status (reused from list) ───

function getDetailStatus(item: BoardItem) {
  const now = Date.now()
  const startMs = item.start_dt ? toMillis(item.start_dt) : 0
  const endMs = item.end_dt ? toMillis(item.end_dt) : 0

  if (startMs && now < startMs) {
    return { label: "예정", variant: "secondary" as const }
  }
  if (endMs && now > endMs) {
    return { label: "종료", variant: "destructive" as const }
  }
  return { label: "진행중", variant: "default" as const }
}

// ─── HTML description renderer ───

function isHtml(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text)
}

function DescriptionRenderer({ text }: { text: string }) {
  if (isHtml(text)) {
    return (
      <div
        className="prose prose-sm max-w-none text-foreground/80 leading-relaxed
          [&_p]:my-2 [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-3"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }
  return (
    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
      {text}
    </p>
  )
}

// ─── Coupon section ───

function CouponSection({ coupons, exhibitionKey }: { coupons: Coupon[]; exhibitionKey: number }) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [receivedSet, setReceivedSet] = useState<Set<number>>(
    () => new Set(coupons.filter((c) => c.received).map((c) => c.coupon_pk))
  )
  const [loadingPk, setLoadingPk] = useState<number | null>(null)

  const handleDownload = async (couponPk: number) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    if (receivedSet.has(couponPk)) return

    setLoadingPk(couponPk)
    try {
      await downloadCoupon({
        type: COUPON_DOWNLOAD_TYPE.EXHIBITION,
        key: String(exhibitionKey),
      })
      setReceivedSet((prev) => new Set(prev).add(couponPk))
    } catch {
      // 이미 받은 쿠폰이거나 에러 — 조용히 처리
    } finally {
      setLoadingPk(null)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
        <Ticket className="size-4" />
        쿠폰 ({coupons.length})
      </div>
      <div className="space-y-2">
        {coupons.map((coupon) => {
          const isReceived = receivedSet.has(coupon.coupon_pk)
          const isLoading = loadingPk === coupon.coupon_pk

          return (
            <div
              key={coupon.coupon_pk}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{coupon.title}</p>
                  <Badge variant="default" className="shrink-0 bg-primary/90">
                    {coupon.discount_type === "RATE"
                      ? `${coupon.discount_amount}%`
                      : `${coupon.discount_amount.toLocaleString()}원`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {coupon.description}
                </p>
              </div>
              <Button
                variant={isReceived ? "outline" : "default"}
                size="sm"
                className="shrink-0 gap-1"
                disabled={isReceived || isLoading}
                onClick={() => handleDownload(coupon.coupon_pk)}
              >
                {isReceived ? (
                  <>
                    <Check className="size-3.5" />
                    받음
                  </>
                ) : isLoading ? (
                  "받는 중..."
                ) : (
                  <>
                    <Download className="size-3.5" />
                    받기
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Linked stores section ───

function LinkedStoresSection({ stores }: { stores: StoreItem[] }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
        <Store className="size-4" />
        참여 숙소 ({stores.length})
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stores.map((store) => (
          <AccommodationCard
            key={store.key}
            accommodation={mapStoreToAccommodation(store)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Sort tags section ───

function SortTagsSection({ tags }: { tags: BoardItemSortTag[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.key}
          variant="secondary"
          className={cn(
            "gap-1 text-xs font-normal",
            "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          <Tag className="size-3" />
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}

// ─── Main ───

export function ExhibitionDetailPage({ exhibitionKey }: { exhibitionKey: number }) {
  const { exhibition, sortTags, isLoading, isError, refetch } = useExhibitionDetail(exhibitionKey)

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <LoadingSpinner />
      </Container>
    )
  }

  if (isError || !exhibition) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <Link
          href="/exhibitions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          기획전 목록
        </Link>
        <ErrorState
          message="기획전을 불러오지 못했습니다"
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  const status = getDetailStatus(exhibition)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: exhibition.title,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      {/* Back */}
      <Link
        href="/exhibitions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        기획전 목록
      </Link>

      <article className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Hero image */}
        {exhibition.detail_banner_image_url && (
          <div className="relative aspect-[2/1] bg-muted">
            <Image
              src={exhibition.detail_banner_image_url}
              alt={exhibition.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Status + share */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={status.variant} className="gap-1">
                <Sparkles className="size-3" />
                {status.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                기획전
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="size-8" onClick={handleShare}>
              <Share2 className="size-4" />
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold leading-snug">{exhibition.title}</h1>

          {/* Thumb description */}
          {exhibition.thumb_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {exhibition.thumb_description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            {(exhibition.start_dt || exhibition.end_dt) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0" />
                {formatTimestampDot(exhibition.start_dt)} ~ {formatTimestampDot(exhibition.end_dt)}
              </span>
            )}
            {exhibition.view_count != null && (
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                조회 {exhibition.view_count.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sort tags — result 최상위에서 가져온 값 */}
          {sortTags.length > 0 && <SortTagsSection tags={sortTags} />}

          {/* Description */}
          {exhibition.description && exhibition.description !== "." && (
            <div className="mt-5 pt-5 border-t">
              <DescriptionRenderer text={exhibition.description} />
            </div>
          )}

          {/* Image gallery */}
          {exhibition.image_urls && exhibition.image_urls.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
                <Images className="size-4" />
                이미지 ({exhibition.image_urls.length})
              </div>
              <div className="space-y-2">
                {exhibition.image_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${exhibition.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 560px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupons (v2_total_coupons) */}
          {exhibition.v2_total_coupons && exhibition.v2_total_coupons.length > 0 && (
            <CouponSection coupons={exhibition.v2_total_coupons} exhibitionKey={exhibitionKey} />
          )}
        </div>
      </article>

      {/* Linked stores — 기획전 참여 숙소 */}
      {exhibition.linked_stores && exhibition.linked_stores.length > 0 && (
        <div className="mt-6">
          <LinkedStoresSection stores={exhibition.linked_stores} />
        </div>
      )}
    </Container>
  )
}
