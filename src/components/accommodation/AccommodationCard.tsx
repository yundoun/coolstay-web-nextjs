"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Heart, Star } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth"
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
  couponDiscount?: number
  address?: string
  benefitTags?: string[]
  gradeTags?: string[]
  supportFlags?: string[]
  rentPrice?: number
  rentOriginalPrice?: number
  rentCouponAppliedPrice?: number
  rentCouponLabel?: string
  rentUseTime?: string            // 대실 이용시간 ("최대 3시간")
  rentRemainCount?: number        // 대실 잔여 객실 수
  stayPrice?: number
  stayOriginalPrice?: number
  stayCouponAppliedPrice?: number
  stayCouponLabel?: string
  stayCheckIn?: string            // 숙박 체크인 시간 ("17:00~")
  stayRemainCount?: number        // 숙박 잔여 객실 수
  sitePayment?: boolean           // 현장결제 가능
}

export interface AccommodationCardProps {
  accommodation: Accommodation
  priority?: boolean
  onToggleFavorite?: (id: string, isLiked: boolean) => void
}

export function AccommodationCard({ accommodation, priority = false, onToggleFavorite }: AccommodationCardProps) {
  const [liked, setLiked] = useState(!!accommodation.isLiked)
  const [toggling, setToggling] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const handleHeartClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onToggleFavorite || toggling) return
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
      return
    }
    const prev = liked
    setLiked(!prev)
    setToggling(true)
    try {
      await onToggleFavorite(accommodation.id, prev)
    } catch {
      setLiked(prev)
    } finally {
      setToggling(false)
    }
  }, [onToggleFavorite, toggling, liked, accommodation.id, isLoggedIn, router, pathname])

  const hasRent = accommodation.rentPrice != null
  const hasStay = accommodation.stayPrice != null

  return (
    <Link href={`/accommodations/${accommodation.id}`} className="block bg-white">
      <article>
        {/* ── 이미지 영역 (비율 2:1, 라운드) ── */}
        <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-neutral-200">
          {accommodation.imageUrl ? (
            <Image
              src={accommodation.imageUrl}
              alt={accommodation.name}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 360px"
            />
          ) : (
            <div className="flex flex-col h-full w-full items-center justify-center text-muted-foreground gap-1">
              <span className="text-3xl">🐝</span>
              <span className="text-sm">이미지 준비중</span>
            </div>
          )}

          {/* 하단 그라디언트 + 숙소명/별점/위치 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-2.5 pt-12">
            <h3 className="text-white font-bold text-base leading-tight line-clamp-1 drop-shadow-sm">
              {accommodation.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              {accommodation.rating != null && accommodation.rating > 0 && (
                <span className="flex items-center gap-0.5 text-[#d7d7d7] text-[11px]">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{accommodation.rating.toFixed(1)}</span>
                  {accommodation.reviewCount != null && accommodation.reviewCount > 0 && (
                    <span>(+{accommodation.reviewCount.toLocaleString()})</span>
                  )}
                </span>
              )}
              {accommodation.location && (
                <span className="text-[#d7d7d7] text-[11px]">{accommodation.location}</span>
              )}
            </div>
          </div>

          {/* 하트 버튼 (우상단) */}
          <button
            className="absolute right-3 top-3"
            onClick={handleHeartClick}
            disabled={toggling}
          >
            <Heart className={cn(
              "size-6",
              liked ? "fill-red-500 text-red-500" : "fill-white/30 text-white"
            )} />
          </button>
        </div>

        {/* ── 대실 / 숙박 가격 2열 (항상 동일 구조) ── */}
        <div className="grid grid-cols-2 gap-0 px-1.5 pt-2 pb-3 min-h-[103px]">
          {/* 대실 */}
          <div className="px-1.5">
            {hasRent ? (
              <PriceColumn
                label="대실"
                subInfo={accommodation.rentUseTime}
                remainCount={accommodation.rentRemainCount}
                price={accommodation.rentPrice!}
                originalPrice={accommodation.rentOriginalPrice}
                couponAppliedPrice={accommodation.rentCouponAppliedPrice}
                couponLabel={accommodation.rentCouponLabel}
              />
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6">-</div>
            )}
          </div>
          {/* 숙박 */}
          <div className="px-1.5">
            {hasStay ? (
              <PriceColumn
                label="숙박"
                subInfo={accommodation.stayCheckIn}
                remainCount={accommodation.stayRemainCount}
                price={accommodation.stayPrice!}
                originalPrice={accommodation.stayOriginalPrice}
                couponAppliedPrice={accommodation.stayCouponAppliedPrice}
                couponLabel={accommodation.stayCouponLabel}
              />
            ) : !hasRent ? (
              /* 대실·숙박 모두 없으면 단일 가격 우측 표시 */
              <PriceColumn
                label={accommodation.priceLabel ?? ""}
                price={accommodation.price}
                originalPrice={accommodation.originalPrice}
              />
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6">-</div>
            )}
          </div>
        </div>

        {/* ── 하단 바 (앱 동일 — 고정 1줄, 플래그 최대 3개 + 마일리지 우측) ── */}
        <div className="mx-1.5 mb-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#F5F5F5] h-[30px]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#8B909B] truncate">
              {[
                ...(accommodation.supportFlags?.slice(0, 3) ?? []),
                ...(accommodation.sitePayment ? ["현장결제"] : []),
              ].slice(0, 3).map((flag) => (
                <span key={flag}>{flag}</span>
              ))}
            </div>
            {accommodation.mileageRate != null && accommodation.mileageRate > 0 && (
              <span className="flex items-center gap-1 shrink-0 text-[11px] font-bold text-[#FF9500]">
                <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-[#FF9500] text-[8px] font-bold text-white">M</span>
                적립 {accommodation.mileageRate}%
              </span>
            )}
          </div>
        </div>

        {/* 카드 간 구분선 */}
        <div className="h-px bg-border" />
      </article>
    </Link>
  )
}

/** 대실/숙박 가격 열 */
function PriceColumn({
  label,
  subInfo,
  remainCount,
  price,
  originalPrice,
  couponAppliedPrice,
  couponLabel,
}: {
  label: string
  subInfo?: string
  remainCount?: number
  price: number
  originalPrice?: number
  couponAppliedPrice?: number
  couponLabel?: string
}) {
  // 1단계: 기본 할인 (originalPrice → price)
  const baseDiscountRate =
    originalPrice != null && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  // 2단계: 쿠폰 할인 (price → couponAppliedPrice)
  const hasCoupon = couponAppliedPrice != null && couponAppliedPrice < price
  const couponAmount = hasCoupon ? price - couponAppliedPrice! : 0
  const finalPrice = hasCoupon ? couponAppliedPrice! : price

  return (
    <div>
      {/* 라벨 + 부가 정보 */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold">{label}</span>
        {(subInfo || (remainCount != null && remainCount > 0 && remainCount <= 5)) && (
          <span className="text-[11px] text-muted-foreground">
            {subInfo}
            {remainCount != null && remainCount > 0 && remainCount <= 5 && (
              <>{subInfo ? " · " : ""}<span className="text-orange-500 font-semibold">{remainCount}개 남음</span></>
            )}
          </span>
        )}
      </div>

      {/* 1단계: 할인율 + 원가(취소선) */}
      {baseDiscountRate != null && baseDiscountRate > 0 ? (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-sm font-bold text-[#FF6C2C]">{baseDiscountRate}%</span>
          <span className="text-xs text-muted-foreground line-through">
            {originalPrice!.toLocaleString()}원
          </span>
        </div>
      ) : (
        <div className="mt-1.5" />
      )}

      {/* 2단계: 쿠폰 있으면 판매가(취소선) → 쿠폰 → 최종가 */}
      {hasCoupon ? (
        <>
          <p className="text-sm text-muted-foreground line-through">{price.toLocaleString()}원</p>
          <p className="text-lg font-extrabold tracking-tight">{finalPrice.toLocaleString()}원</p>
          {couponLabel && (
            <span className="inline-block mt-0.5 text-[11px] font-medium text-[#FF6C2C] border border-[#FF6C2C] rounded px-1.5 py-0.5">
              {couponLabel} -{couponAmount.toLocaleString()}원
            </span>
          )}
        </>
      ) : (
        <p className="text-lg font-extrabold tracking-tight">{price.toLocaleString()}원</p>
      )}
    </div>
  )
}
