"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Accommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  priceLabel?: string
  likeCount?: number
  isLiked?: boolean
  imageUrl: string
  tags?: string[]
  isSoldOut?: boolean
  partnershipType?: string
  consecutiveYn?: string
  rating?: number
  reviewCount?: number
  mileageRate?: number
  hasCoupon?: boolean
  couponDiscount?: number      // 쿠폰 최대 할인액
  address?: string
  benefitTags?: string[]       // 혜택 태그 (benefit_tags)
  gradeTags?: string[]         // 등급 태그 (grade_tags, 호텔 성급 등)
  supportFlags?: string[]      // v2_support_flag에서 활성화된 라벨 목록
  // 대실/숙박 별도 가격
  rentPrice?: number
  rentOriginalPrice?: number
  rentCouponAppliedPrice?: number  // 쿠폰 적용 후 대실 가격
  rentCouponLabel?: string         // 쿠폰 라벨 (무제한, 선착순 등)
  stayPrice?: number
  stayOriginalPrice?: number
  stayCouponAppliedPrice?: number  // 쿠폰 적용 후 숙박 가격
  stayCouponLabel?: string         // 쿠폰 라벨
}

export interface AccommodationCardProps {
  accommodation: Accommodation
  priority?: boolean
}

export function AccommodationCard({ accommodation, priority = false }: AccommodationCardProps) {
  const discount = accommodation.originalPrice
    ? Math.round(
        ((accommodation.originalPrice - accommodation.price) /
          accommodation.originalPrice) *
          100
      )
    : null

  return (
    <Link
      href={`/accommodations/${accommodation.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-xl bg-card transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {accommodation.imageUrl ? (
            <Image
              src={accommodation.imageUrl}
              alt={accommodation.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-sm">이미지 없음</span>
            </div>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <Badge
              variant="default"
              className="absolute left-3 top-3 rounded-md font-bold"
            >
              {discount}%
            </Badge>
          )}

          {/* Support Flag Badges */}
          {accommodation.supportFlags && accommodation.supportFlags.length > 0 && (
            <div className="absolute left-3 bottom-3 flex flex-wrap gap-1">
              {accommodation.supportFlags.slice(0, 2).map((flag) => (
                <Badge
                  key={flag}
                  className="rounded-md bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 size-8 rounded-full",
              "bg-black/20 backdrop-blur-sm",
              accommodation.isLiked
                ? "text-red-500 hover:bg-black/30 hover:text-red-500"
                : "text-white hover:bg-black/30 hover:text-white"
            )}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Heart className={cn("size-4", accommodation.isLiked && "fill-current")} />
            <span className="sr-only">찜하기</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Grade Tags (호텔 성급 등) */}
          {accommodation.gradeTags && accommodation.gradeTags.length > 0 && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {accommodation.gradeTags.map((tag) => (
                <Badge key={tag} className="bg-indigo-100 text-indigo-700 text-[10px] font-medium hover:bg-indigo-100">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Tags + Benefit Tags */}
          {((accommodation.tags && accommodation.tags.length > 0) || (accommodation.benefitTags && accommodation.benefitTags.length > 0)) && (
            <div className="mb-2 flex flex-wrap gap-1">
              {accommodation.benefitTags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal text-emerald-700 border-emerald-200 bg-emerald-50">
                  {tag}
                </Badge>
              ))}
              {accommodation.tags?.slice(0, 3 - (accommodation.benefitTags?.length ?? 0)).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Name & Location */}
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {accommodation.name}
          </h3>
          {accommodation.location && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {accommodation.location}
            </p>
          )}

          {/* Rating · Mileage · Coupon */}
          {(accommodation.rating || accommodation.mileageRate || accommodation.hasCoupon) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              {accommodation.rating != null && accommodation.rating > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{accommodation.rating.toFixed(1)}</span>
                  {accommodation.reviewCount != null && accommodation.reviewCount > 0 && (
                    <span>({accommodation.reviewCount.toLocaleString()})</span>
                  )}
                </span>
              )}
              {accommodation.mileageRate != null && accommodation.mileageRate > 0 && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600">
                  <span className="font-medium">+{accommodation.mileageRate}% 적립</span>
                </span>
              )}
              {(accommodation.hasCoupon || (accommodation.couponDiscount != null && accommodation.couponDiscount > 0)) && (
                <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-px text-primary font-medium">
                  <Ticket className="size-3" />
                  {accommodation.couponDiscount != null && accommodation.couponDiscount > 0
                    ? `-${accommodation.couponDiscount.toLocaleString()}원`
                    : "쿠폰"}
                </span>
              )}
            </div>
          )}

          {/* Like Count */}
          {accommodation.likeCount != null && accommodation.likeCount > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              <Heart className="size-3.5 fill-rose-400 text-rose-400" />
              <span className="text-sm text-muted-foreground">
                {accommodation.likeCount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Price — 대실/숙박 행 */}
          {(accommodation.rentPrice != null || accommodation.stayPrice != null) ? (
            <div className="mt-3 space-y-2">
              {accommodation.rentPrice != null && (
                <PriceRow
                  label="대실"
                  price={accommodation.rentPrice}
                  originalPrice={accommodation.rentOriginalPrice}
                  couponAppliedPrice={accommodation.rentCouponAppliedPrice}
                  couponLabel={accommodation.rentCouponLabel}
                />
              )}
              {accommodation.stayPrice != null && (
                <PriceRow
                  label="숙박"
                  price={accommodation.stayPrice}
                  originalPrice={accommodation.stayOriginalPrice}
                  couponAppliedPrice={accommodation.stayCouponAppliedPrice}
                  couponLabel={accommodation.stayCouponLabel}
                />
              )}
            </div>
          ) : (
            <div className="mt-3 flex items-baseline gap-2">
              {accommodation.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {accommodation.originalPrice.toLocaleString()}원
                </span>
              )}
              <span className="text-lg font-bold text-foreground">
                {accommodation.price.toLocaleString()}원
              </span>
              {accommodation.priceLabel && (
                <span className="text-sm text-muted-foreground">
                  {accommodation.priceLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

/** 대실/숙박 가격 행 */
function PriceRow({
  label,
  price,
  originalPrice,
  couponAppliedPrice,
  couponLabel,
}: {
  label: string
  price: number
  originalPrice?: number
  couponAppliedPrice?: number
  couponLabel?: string
}) {
  const discountRate =
    originalPrice != null && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  const hasCoupon = couponAppliedPrice != null && couponAppliedPrice < price
  const couponDiscountAmount = hasCoupon ? price - couponAppliedPrice! : 0

  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2.5">
      {/* 상단: 라벨 + 정가/할인율 + 할인가 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
            {label}
          </span>
          {discountRate != null && discountRate > 0 && (
            <span className="text-sm font-extrabold text-primary-700">{discountRate}%</span>
          )}
          {originalPrice != null && originalPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              {originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        <span className={cn(
          "font-bold",
          hasCoupon
            ? "text-sm text-muted-foreground line-through"
            : "text-lg text-foreground"
        )}>
          {price.toLocaleString()}원
        </span>
      </div>

      {/* 하단: 쿠폰 실결제가 — 최종 가격이 가장 크고 진하게 */}
      {hasCoupon && (
        <div className="mt-1.5 flex items-center justify-between rounded-md bg-primary/10 px-2.5 py-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-700">
            <Ticket className="size-3" />
            {couponLabel} -{couponDiscountAmount.toLocaleString()}원
          </span>
          <span className="text-lg font-extrabold text-foreground">
            {couponAppliedPrice!.toLocaleString()}원
          </span>
        </div>
      )}
    </div>
  )
}
