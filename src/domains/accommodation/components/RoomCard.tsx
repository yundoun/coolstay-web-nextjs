"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Users, Clock, Moon, Ticket, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { cn } from "@/lib/utils"
import type { Room } from "../types"
import type { Coupon } from "@/lib/api/types"
import { calcBestCouponPrice } from "@/lib/utils/coupon"

interface RoomCardProps {
  room: Room
  accommodationId: string
  benefitPointRate?: number
  onRentalClick?: (room: Room) => void
}

export function RoomCard({ room, accommodationId, benefitPointRate = 0, onRentalClick }: RoomCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const images = (room.images.length > 0 ? room.images : [room.imageUrl]).filter(
    (url) => url && url.trim() !== ""
  )

  const hasRental = room.rentalAvailable && room.rentalPrice != null

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        room.isAvailable ? "hover:shadow-md transition-shadow" : "opacity-60"
      )}
    >
      {/* PC: 이미지 좌측 + 우측(객실정보 + 가격)  /  모바일: 세로 스택 */}
      <div className="flex flex-col sm:flex-row">
        {/* 이미지 */}
        <div
          className={cn(
            "relative w-full sm:w-44 lg:w-52 aspect-[16/9] sm:aspect-auto sm:min-h-[140px] overflow-hidden shrink-0",
            images.length > 0 && "cursor-pointer"
          )}
          onClick={() => images.length > 0 && setLightboxOpen(true)}
        >
          {room.imageUrl ? (
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <span className="text-muted-foreground/30 text-sm">No Image</span>
            </div>
          )}
          {!room.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">매진</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium">
              {images.length}장
            </div>
          )}
        </div>

        {/* 우측: 객실정보 + 가격 */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 객실 기본 정보 */}
          <div className="px-4 pt-3 pb-2">
            <h3 className="font-semibold text-sm">{room.name}</h3>
            {room.description && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{room.description}</p>
            )}
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3" />
                기준 {room.maxAdults}인 / 최대 {room.maxGuests}인
              </span>
              {room.keywords.length > 0 && (
                <span className="hidden sm:inline text-muted-foreground/60">
                  {room.keywords.join(" · ")}
                </span>
              )}
            </div>
          </div>

          {/* 대실/숙박 가격 — PC: 가로 나란히 / 모바일: 세로 스택 */}
          <div className={cn(
            "flex-1 border-t",
            hasRental ? "sm:grid sm:grid-cols-2 sm:divide-x divide-y sm:divide-y-0" : ""
          )}>
            {hasRental && (
              <PriceSection
                type="rental"
                price={room.rentalPrice!}
                originalPrice={room.rentalOriginalPrice}
                coupons={room.rentalCoupons}
                timeInfo={room.rentalTime}
                startHour={room.rentalStartHour}
                endHour={room.rentalEndHour}
                benefitPointRate={benefitPointRate}
                remainingCount={room.remainingCount}
                isAvailable={room.isAvailable}
                onAction={() => onRentalClick?.(room)}
              />
            )}
            <PriceSection
              type="stay"
              price={room.stayPrice}
              originalPrice={room.stayOriginalPrice}
              coupons={room.stayCoupons}
              startHour={room.stayStartHour}
              endHour={room.stayEndHour}
              benefitPointRate={benefitPointRate}
              remainingCount={room.remainingCount}
              isAvailable={room.stayAvailable}
              bookingHref={`/booking/${accommodationId}?room=${room.id}&type=stay`}
            />
          </div>
        </div>
      </div>

      <ImageLightbox
        images={images}
        initialIndex={0}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        alt={room.name}
      />
    </div>
  )
}

/** 대실/숙박 가격 섹션 */
function PriceSection({
  type,
  price,
  originalPrice,
  coupons,
  timeInfo,
  startHour,
  endHour,
  benefitPointRate,
  remainingCount,
  isAvailable,
  onAction,
  bookingHref,
}: {
  type: "rental" | "stay"
  price: number
  originalPrice?: number
  coupons?: Coupon[]
  timeInfo?: string
  startHour?: number
  endHour?: number
  benefitPointRate: number
  remainingCount: number
  isAvailable: boolean
  onAction?: () => void
  bookingHref?: string
}) {
  const isRental = type === "rental"
  const label = isRental ? "대실" : "숙박"
  const LabelIcon = isRental ? Clock : Moon

  // 1단계: 기본 할인 (originalPrice → price)
  const baseDiscountRate = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  // 2단계: 쿠폰 할인 (price → finalPrice)
  const bestCoupon = calcBestCouponPrice(coupons, price)
  const finalPrice = bestCoupon ? bestCoupon.appliedPrice : price

  const mileageAmount = benefitPointRate > 0
    ? Math.floor(finalPrice * (benefitPointRate / 100))
    : 0

  const timeText = isRental
    ? timeInfo
      ? `${timeInfo}${startHour != null && endHour != null ? ` (${startHour}:00 ~ ${endHour}:00)` : ""}`
      : startHour != null && endHour != null
        ? `${startHour}:00 ~ ${endHour}:00`
        : undefined
    : startHour != null && endHour != null
      ? `체크인 ${startHour}:00 · 체크아웃 ${endHour}:00`
      : undefined

  return (
    <div className="px-4 py-2.5">
      {/* 라벨 + 시간 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <LabelIcon className="size-3 text-muted-foreground" />
        <span className="text-xs font-semibold">{label}</span>
        {timeText && (
          <span className="text-[11px] text-muted-foreground">{timeText}</span>
        )}
      </div>

      {/* 가격 + 예약 버튼 한 행 */}
      <div className="flex items-end justify-between gap-3">
        <div className="text-right flex-1">
          {/* 1단계: 할인율 + 원가(취소선) */}
          {originalPrice != null && originalPrice > price && (
            <div className="flex items-center justify-end gap-1 mb-0.5">
              {baseDiscountRate != null && baseDiscountRate > 0 && (
                <span className="text-xs font-bold text-red-500">{baseDiscountRate}%</span>
              )}
              <span className="text-[11px] text-muted-foreground line-through">
                {originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* 2단계: 판매가 (쿠폰 있으면 취소선 + 회색) */}
          {bestCoupon ? (
            <>
              <p className="text-sm text-muted-foreground line-through leading-tight">
                {price.toLocaleString()}원
              </p>
              <div className="flex items-center justify-end gap-0.5 mt-0.5">
                <Ticket className="size-2.5 text-primary" />
                <span className="text-[10px] text-primary font-medium">
                  {bestCoupon.label} -{bestCoupon.bestDiscount.toLocaleString()}원
                </span>
              </div>
              <p className="text-lg font-extrabold text-foreground leading-tight">
                {finalPrice.toLocaleString()}<span className="text-xs font-bold">원</span>
              </p>
            </>
          ) : (
            <p className="text-lg font-extrabold text-foreground leading-tight">
              {price.toLocaleString()}<span className="text-xs font-bold">원</span>
            </p>
          )}

          {/* 마일리지 */}
          {mileageAmount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              최대 <span className="font-semibold text-emerald-600">{mileageAmount.toLocaleString()}P</span> 적립
            </span>
          )}
        </div>

        {/* 예약 버튼 */}
        {isAvailable ? (
          bookingHref ? (
            <Button size="sm" className="rounded-lg px-4 shrink-0" asChild>
              <Link href={bookingHref}>예약</Link>
            </Button>
          ) : (
            <Button size="sm" className="rounded-lg px-4 shrink-0" onClick={onAction}>
              예약
            </Button>
          )
        ) : (
          <Button size="sm" variant="outline" disabled className="rounded-lg px-4 shrink-0">
            매진
          </Button>
        )}
      </div>

      {/* 남은 객실 */}
      {isAvailable && remainingCount > 0 && remainingCount <= 5 && (
        <p className="text-[11px] font-semibold text-orange-500 text-right mt-1">
          남은객실 {remainingCount}개
        </p>
      )}
    </div>
  )
}
