"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, MapPin, Loader2, Ticket } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { useFavorites } from "../hooks/useFavorites"
import type { StoreItem } from "@/lib/api/types"

export function FavoritesPage() {
  const {
    wishlistItems,
    isLoading,
    error,
    removeFavorites,
  } = useFavorites()

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">찜한 숙소</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive">{error}</div>
      ) : wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="찜한 숙소가 없습니다"
          description="마음에 드는 숙소를 찜해보세요"
          action={{ label: "숙소 둘러보기", href: "/search" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.key}
              item={item}
              onRemoveFavorite={() => removeFavorites([item.key])}
            />
          ))}
        </div>
      )}
    </Container>
  )
}

/** 찜 목록 카드 — StoreItem 기반 */
function WishlistCard({
  item,
  onRemoveFavorite,
}: {
  item: StoreItem
  onRemoveFavorite: () => void
}) {
  const mainImage = item.images?.[0]?.url || item.images?.[0]?.thumb_url || null
  const firstRoom = item.items?.[0]
  const price = firstRoom?.discount_price ?? firstRoom?.price ?? 0
  const originalPrice =
    firstRoom && firstRoom.price > (firstRoom.discount_price ?? firstRoom.price)
      ? firstRoom.price
      : undefined

  return (
    <Link href={`/accommodations/${item.key}`}>
      <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3]">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              이미지 없음
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 size-8 rounded-full bg-black/20 backdrop-blur-sm text-red-500 hover:bg-black/30 hover:text-red-500"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemoveFavorite()
            }}
          >
            <Heart className="size-4 fill-current" />
            <span className="sr-only">찜 해제</span>
          </Button>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{item.name}</h3>
          {(item.distance || item.location?.address) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3" />
              {item.location?.address || item.distance}
            </p>
          )}
          {/* Rating · Mileage · Coupon */}
          {(item.rating || item.benefit_point_rate || item.download_coupon_info) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
              {item.rating && parseFloat(item.rating.avg_score) > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{parseFloat(item.rating.avg_score).toFixed(1)}</span>
                  {item.rating.review_count > 0 && (
                    <span>({item.rating.review_count.toLocaleString()})</span>
                  )}
                </span>
              )}
              {item.benefit_point_rate != null && item.benefit_point_rate > 0 && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
                  +{item.benefit_point_rate}% 적립
                </span>
              )}
              {item.download_coupon_info && item.download_coupon_info.status !== "NON_TARGET" && (
                <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-px text-primary font-medium">
                  <Ticket className="size-2.5" />
                  쿠폰
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Heart className="size-3.5 text-red-400" />
              <span className="text-xs font-medium">{item.like_count}</span>
            </div>
            <div className="text-right">
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through mr-1">
                  {originalPrice.toLocaleString()}
                </span>
              )}
              {price > 0 && (
                <span className="font-bold text-sm">
                  {price.toLocaleString()}원
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
