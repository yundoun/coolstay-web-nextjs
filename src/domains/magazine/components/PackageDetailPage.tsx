"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Gift, Star } from "lucide-react"
import { Section } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { usePackageDetail } from "../hooks/useMagazine"
import type { StoreItem } from "@/lib/api/types"
import type { BoardItem, CouponItem } from "../types"

interface Props {
  packageKey: number
}

export function PackageDetailPage({ packageKey }: Props) {
  const { data, isLoading } = usePackageDetail(packageKey)
  const item = data?.board_items?.[0]

  if (isLoading) return <PackageDetailSkeleton />
  if (!item) {
    return (
      <Section spacing="md">
        <div className="py-20 text-center text-muted-foreground">
          패키지를 찾을 수 없습니다
        </div>
      </Section>
    )
  }

  const isClosed = item.end_dt ? item.end_dt * 1000 < Date.now() : false
  // AOS 패턴: image_urls[0] = 배너, [1:] = 갤러리
  const bannerImage = item.image_urls?.[0] ?? item.detail_banner_image_url
  const galleryImages = item.image_urls?.slice(1) ?? []

  return (
    <main>
      {/* 상단 배너 */}
      {bannerImage && (
        <div className="relative aspect-[2/1] sm:aspect-[3/1]">
          <Image
            src={bannerImage}
            alt={item.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mx-auto max-w-3xl">
              {isClosed && (
                <Badge className="mb-2 bg-gray-500 text-white border-none">마감</Badge>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h1>
              {item.start_dt && item.end_dt && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                  <Calendar className="size-3.5" />
                  {formatDate(item.start_dt)} ~ {formatDate(item.end_dt)}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/magazine/package"
            className="absolute top-4 left-4 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
        </div>
      )}

      {/* 태그 */}
      {item.tags && item.tags.length > 0 && (
        <Section spacing="sm">
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="size-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {/* HTML 본문 */}
      {item.description && (
        <Section spacing="md">
          <article
            className="prose prose-sm sm:prose max-w-none dark:prose-invert
              prose-img:rounded-xl prose-img:w-full
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </Section>
      )}

      {/* 이미지 갤러리 */}
      {galleryImages.length > 0 && (
        <Section spacing="md" background="muted">
          <h2 className="text-lg font-bold mb-4">갤러리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={url}
                  alt={`갤러리 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 전체 쿠폰 */}
      {item.v2_total_coupons && item.v2_total_coupons.length > 0 && (
        <Section spacing="md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Gift className="size-5 text-primary" />
            쿠폰
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.v2_total_coupons.map((coupon) => (
              <CouponCard key={coupon.coupon_pk} coupon={coupon} />
            ))}
          </div>
        </Section>
      )}

      {/* 연결 숙소 */}
      {item.linked_stores && item.linked_stores.length > 0 && (
        <Section
          title="연결 숙소"
          description="이 패키지에 참여하는 숙소"
          spacing="md"
          background="muted"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.linked_stores.map((store) => (
              <LinkedStoreCard key={store.key} store={store} />
            ))}
          </div>
        </Section>
      )}

      {/* 하단 배너 이미지 */}
      {(item.bottom_image_url || data?.bottomImageUrl) && (
        <Section spacing="sm">
          <div className="relative aspect-[3/1] rounded-xl overflow-hidden">
            <Image
              src={item.bottom_image_url ?? data!.bottomImageUrl!}
              alt="하단 배너"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </Section>
      )}
    </main>
  )
}

function CouponCard({ coupon }: { coupon: CouponItem }) {
  const isRate = coupon.discount_type === "RATE"
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div className="text-center">
        <p className="text-xl font-bold text-primary">
          {isRate
            ? `${coupon.discount_amount}%`
            : `${coupon.discount_amount.toLocaleString()}원`}
        </p>
        <p className="text-[10px] text-muted-foreground">할인</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-1">{coupon.title}</p>
        {coupon.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {coupon.description}
          </p>
        )}
      </div>
    </div>
  )
}

function LinkedStoreCard({ store }: { store: StoreItem }) {
  const image = store.images?.[0]
  const firstItem = store.items?.[0]

  return (
    <Link
      href={`/accommodation/${store.key}`}
      className="group flex gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-md"
    >
      <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-lg">
        {image?.url ? (
          <Image
            src={image.thumb_url || image.url}
            alt={store.name}
            fill
            className="object-cover"
            sizes="96px"
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
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {store.rating.avg_score} ({store.rating.review_count})
          </p>
        )}
        {firstItem && (
          <p className="mt-1.5 text-sm font-medium text-primary">
            {firstItem.discount_price?.toLocaleString()}원~
          </p>
        )}
        {store.coupons && store.coupons.length > 0 && (
          <Badge variant="secondary" className="mt-1.5 text-[10px]">
            <Gift className="size-2.5 mr-0.5" />
            쿠폰 {store.coupons.length}장
          </Badge>
        )}
      </div>
    </Link>
  )
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function PackageDetailSkeleton() {
  return (
    <main>
      <Skeleton className="aspect-[2/1] sm:aspect-[3/1] w-full" />
      <Section spacing="md">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-60 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Section>
    </main>
  )
}
