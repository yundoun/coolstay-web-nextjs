"use client"

import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from "./ImageGallery"
import { AccommodationInfo } from "./AccommodationInfo"
import { AmenityList } from "./AmenityList"
import { RoomCard } from "./RoomCard"
import { ReviewSection } from "./ReviewSection"
import { PolicySection } from "./PolicySection"
import { EventBanner } from "./EventBanner"
import type { AccommodationDetail } from "../types"

interface AccommodationDetailLayoutProps {
  accommodation: AccommodationDetail
}

export function AccommodationDetailLayout({
  accommodation,
}: AccommodationDetailLayoutProps) {
  return (
    <div className="min-h-screen pb-16">
      {/* Image Gallery - Full Width */}
      <Container size="wide" padding="responsive" className="pt-4">
        <ImageGallery images={accommodation.images} name={accommodation.name} />
      </Container>

      {/* Content */}
      <Container size="normal" padding="responsive" className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AccommodationInfo accommodation={accommodation} />

            <Separator />

            <AmenityList amenities={accommodation.amenities} />

            <Separator />

            {/* Events */}
            {accommodation.events.length > 0 && (
              <>
                <EventBanner events={accommodation.events} />
                <Separator />
              </>
            )}

            {/* Rooms */}
            <div>
              <h2 className="text-lg font-semibold mb-4">객실 선택</h2>
              <div className="space-y-4">
                {accommodation.rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    accommodationId={accommodation.id}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <ReviewSection
              reviews={accommodation.reviews}
              bestReviews={accommodation.bestReviews}
              accommodationId={accommodation.id}
            />

            <Separator />

            {/* Policies */}
            <PolicySection policies={accommodation.policies} />
          </div>

          {/* Right: Sticky Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingWidget accommodation={accommodation} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Bottom CTA */}
      <MobileBookingBar accommodation={accommodation} />
    </div>
  )
}

function BookingWidget({
  accommodation,
}: {
  accommodation: AccommodationDetail
}) {
  const discount = accommodation.originalPrice
    ? Math.round(
        ((accommodation.originalPrice - accommodation.price) /
          accommodation.originalPrice) *
          100
      )
    : null

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-lg">
      {/* Price */}
      <div className="mb-4">
        {accommodation.originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground line-through">
              {accommodation.originalPrice.toLocaleString()}원
            </span>
            {discount && (
              <span className="text-sm font-bold text-rose-500">{discount}%</span>
            )}
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {accommodation.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground">원~</span>
          <span className="text-sm text-muted-foreground">/박</span>
        </div>
      </div>

      {/* Date Selection (placeholder) */}
      <div className="space-y-3 mb-4">
        <button className="w-full p-3 rounded-xl border text-left hover:border-primary transition-colors">
          <p className="text-xs text-muted-foreground">체크인</p>
          <p className="text-sm font-medium">날짜 선택</p>
        </button>
        <button className="w-full p-3 rounded-xl border text-left hover:border-primary transition-colors">
          <p className="text-xs text-muted-foreground">체크아웃</p>
          <p className="text-sm font-medium">날짜 선택</p>
        </button>
        <button className="w-full p-3 rounded-xl border text-left hover:border-primary transition-colors">
          <p className="text-xs text-muted-foreground">인원</p>
          <p className="text-sm font-medium">성인 2명</p>
        </button>
      </div>

      {/* Book Button */}
      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
        예약하기
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        예약 확정 전에는 요금이 청구되지 않습니다
      </p>
    </div>
  )
}

function MobileBookingBar({
  accommodation,
}: {
  accommodation: AccommodationDetail
}) {
  const discount = accommodation.originalPrice
    ? Math.round(
        ((accommodation.originalPrice - accommodation.price) /
          accommodation.originalPrice) *
          100
      )
    : null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          {accommodation.originalPrice && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground line-through">
                {accommodation.originalPrice.toLocaleString()}원
              </span>
              {discount && (
                <span className="text-xs font-bold text-rose-500">{discount}%</span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">
              {accommodation.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">원~/박</span>
          </div>
        </div>
        <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          예약하기
        </button>
      </div>
    </div>
  )
}
