"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, AlertCircle, Clock, Moon, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Room } from "../types"
import type { Coupon } from "@/lib/api/types"
import { calcCouponDiscount } from "@/lib/utils/coupon"

interface RoomCardProps {
  room: Room
  accommodationId: string
  onDetailClick?: (room: Room) => void
  onRentalClick?: (room: Room) => void
}

export function RoomCard({ room, accommodationId, onDetailClick, onRentalClick }: RoomCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        "transition-all duration-300",
        room.isAvailable
          ? "hover:shadow-lg hover:border-primary/30 cursor-pointer"
          : "opacity-60"
      )}
      onClick={() => onDetailClick?.(room)}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 p-0 sm:p-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 md:w-56 aspect-[16/9] sm:aspect-auto sm:h-44 rounded-none sm:rounded-xl overflow-hidden shrink-0">
          {room.imageUrl ? (
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 224px"
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
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-4 sm:p-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            {room.isAvailable && room.remainingCount <= 3 && room.remainingCount > 0 && (
              <Badge variant="destructive" className="shrink-0 text-xs">
                <AlertCircle className="size-3 mr-1" />
                {room.remainingCount}실 남음
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {room.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>최대 {room.maxGuests}인</span>
            </div>
            {room.stayStartHour != null && room.stayEndHour != null && (
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>체크인 {room.stayStartHour}시 / 체크아웃 {room.stayEndHour}시</span>
              </div>
            )}
          </div>

          {/* Keywords */}
          {room.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {room.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* 대실/숙박 가격 구분 */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3" onClick={(e) => e.stopPropagation()}>
            {/* 대실 */}
            {room.rentalAvailable && room.rentalPrice && (
              <PriceBox
                label="대실"
                labelIcon={<Clock className="size-3" />}
                subLabel={room.rentalTime ? `(${room.rentalTime})` : undefined}
                price={room.rentalPrice}
                originalPrice={room.rentalOriginalPrice}
                coupons={room.rentalCoupons}
                actionButton={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!room.isAvailable}
                    onClick={() => onRentalClick?.(room)}
                  >
                    {room.isAvailable ? "예약" : "매진"}
                  </Button>
                }
              />
            )}

            {/* 숙박 */}
            <PriceBox
              label="숙박"
              labelIcon={<Moon className="size-3" />}
              price={room.stayPrice}
              originalPrice={room.stayOriginalPrice}
              coupons={room.stayCoupons}
              actionButton={
                <Button
                  size="sm"
                  disabled={!room.stayAvailable}
                  asChild={room.stayAvailable}
                >
                  {room.stayAvailable ? (
                    <Link href={`/booking/${accommodationId}?room=${room.id}&type=stay`}>
                      예약
                    </Link>
                  ) : (
                    "매진"
                  )}
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** 대실/숙박 가격 박스 — Search PriceRow 스타일 통일 */
function PriceBox({
  label,
  labelIcon,
  subLabel,
  price,
  originalPrice,
  coupons,
  actionButton,
}: {
  label: string
  labelIcon: React.ReactNode
  subLabel?: string
  price: number
  originalPrice?: number
  coupons?: Coupon[]
  actionButton: React.ReactNode
}) {
  const discountRate =
    originalPrice != null && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  const usable = coupons?.filter(c => c.usable_yn === "Y" && c.dimmed_yn !== "Y")
  const hasCoupon = usable && usable.length > 0
  const bestDiscount = hasCoupon
    ? Math.max(...usable.map(c => calcCouponDiscount(c, price)))
    : 0
  const couponAppliedPrice = Math.max(0, price - bestDiscount)
  const couponLabel = hasCoupon
    ? usable[0].title?.match(/무제한|선착순|한정|특가/)?.[0] || "쿠폰"
    : ""

  return (
    <div className="flex-1 rounded-xl bg-muted/40 border overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div>
          {/* 라벨 행 */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            {labelIcon}
            <span>{label}</span>
            {subLabel && (
              <span className="text-muted-foreground/60">{subLabel}</span>
            )}
          </div>
          {/* 가격 행: 할인율 + 정가(취소선) + 할인가 */}
          <div className="flex items-baseline gap-1.5">
            {discountRate != null && discountRate > 0 && (
              <span className="text-sm font-extrabold text-primary-700">{discountRate}%</span>
            )}
            {originalPrice != null && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice.toLocaleString()}원
              </span>
            )}
            <span className={cn(
              "font-bold",
              hasCoupon
                ? "text-sm text-muted-foreground line-through"
                : "text-base text-foreground"
            )}>
              {price.toLocaleString()}원
            </span>
          </div>
        </div>
        {actionButton}
      </div>

      {/* 쿠폰 실결제가 — primary 톤 통일 */}
      {hasCoupon && (
        <div className="border-t border-dashed px-3 py-2 bg-primary/10">
          {usable.map((coupon, i) => {
            const isRate = coupon.discount_type === "RATE"
            const discount = calcCouponDiscount(coupon, price)
            const discountLabel = isRate
              ? `-${discount.toLocaleString()}원 (${coupon.discount_amount}%)`
              : `-${discount.toLocaleString()}원`

            return (
              <div key={coupon.coupon_pk || i} className="flex items-center gap-1.5 text-xs mb-1">
                <Ticket className="size-3 text-primary-700 shrink-0" />
                <span className="font-semibold text-primary-700">{discountLabel}</span>
                <span className="text-muted-foreground truncate">{coupon.title}</span>
              </div>
            )
          })}
          <div className="flex items-center justify-between pt-1 border-t border-dashed">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-700">
              <Ticket className="size-3" />
              {couponLabel} -{bestDiscount.toLocaleString()}원
            </span>
            <span className="text-lg font-extrabold text-foreground">
              {couponAppliedPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
