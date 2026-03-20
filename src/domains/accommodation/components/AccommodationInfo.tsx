"use client"

import { Star, MapPin, Clock, Share2, Heart, Coins, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { AccommodationDetail } from "../types"

interface AccommodationInfoProps {
  accommodation: AccommodationDetail
}

export function AccommodationInfo({ accommodation }: AccommodationInfoProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* Tags */}
        {accommodation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {accommodation.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {accommodation.name}
        </h1>

        {/* Location & Rating & Mileage */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>{accommodation.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">
              {accommodation.rating}
            </span>
            <span>({accommodation.reviewCount.toLocaleString()})</span>
          </div>
          {/* 마일리지 적립률 */}
          {accommodation.benefitPointRate > 0 && (
            <div className="flex items-center gap-1 text-primary font-medium">
              <Coins className="size-4" />
              <span>+{accommodation.benefitPointRate}% 적립</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Heart className="size-4" />
            찜하기
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="size-4" />
            공유
          </Button>
        </div>
      </div>

      {/* 쿠폰 섹션 */}
      {accommodation.directDiscountYn && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Ticket className="size-4" />
              직접할인 쿠폰
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
            >
              <Ticket className="size-4" />
              내 쿠폰
            </Button>
          </div>
        </>
      )}

      <Separator />

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">숙소 소개</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {accommodation.description}
        </p>
      </div>

      {/* 사장님 인사말 */}
      {accommodation.greetingMsg && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-medium text-primary mb-1">사장님 인사말</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {accommodation.greetingMsg}
          </p>
        </div>
      )}

      <Separator />

      {/* Check-in/out & Parking */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
          <Clock className="size-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">체크인</p>
            <p className="text-sm text-muted-foreground">{accommodation.checkInTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
          <Clock className="size-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">체크아웃</p>
            <p className="text-sm text-muted-foreground">{accommodation.checkOutTime}</p>
          </div>
        </div>
      </div>

      {accommodation.parkingInfo && (
        <div className="p-4 rounded-xl bg-muted/50">
          <p className="text-sm">
            <span className="font-medium">주차 정보: </span>
            <span className="text-muted-foreground">{accommodation.parkingInfo}</span>
          </p>
        </div>
      )}
    </div>
  )
}
