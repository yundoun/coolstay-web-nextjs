"use client"

import { Phone, Coins } from "lucide-react"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen pb-20 lg:pb-16">
      {/* Image Gallery */}
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

            {accommodation.events.length > 0 && (
              <>
                <EventBanner events={accommodation.events} />
                <Separator />
              </>
            )}

            {/* Rooms */}
            <div>
              <h2 className="text-xl font-semibold mb-4">객실 선택</h2>
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
              bestReview={accommodation.bestReview}
              recentReviews={accommodation.recentReviews}
              accommodationId={accommodation.id}
            />

            <Separator />

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

      {/* Mobile Bottom Bar */}
      <MobileBookingBar accommodation={accommodation} />
    </div>
  )
}

function BookingWidget({ accommodation }: { accommodation: AccommodationDetail }) {
  const lowestStayPrice = Math.min(
    ...accommodation.rooms.filter((r) => r.stayAvailable).map((r) => r.stayPrice)
  )
  const lowestOriginal = accommodation.rooms.find(
    (r) => r.stayPrice === lowestStayPrice
  )?.stayOriginalPrice

  const discount = lowestOriginal
    ? Math.round(((lowestOriginal - lowestStayPrice) / lowestOriginal) * 100)
    : null

  return (
    <div className="rounded-xl border bg-card p-6 shadow-lg">
      {/* Mileage */}
      {accommodation.benefitPointRate > 0 && (
        <div className="flex items-center gap-1.5 mb-3 text-sm text-primary font-medium">
          <Coins className="size-4" />
          <span>+{accommodation.benefitPointRate}% 마일리지 적립</span>
        </div>
      )}

      {/* Price */}
      <div className="mb-4">
        {lowestOriginal && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground line-through">
              {lowestOriginal.toLocaleString()}원
            </span>
            {discount && (
              <span className="text-sm font-bold text-destructive">{discount}%</span>
            )}
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {lowestStayPrice.toLocaleString()}
          </span>
          <span className="text-muted-foreground">원~</span>
          <span className="text-sm text-muted-foreground">/박</span>
        </div>
      </div>

      {/* Date/Guest Selection */}
      <div className="space-y-3 mb-4">
        <Button variant="outline" className="w-full justify-start rounded-xl h-auto p-3">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">체크인</p>
            <p className="text-sm font-medium">날짜 선택</p>
          </div>
        </Button>
        <Button variant="outline" className="w-full justify-start rounded-xl h-auto p-3">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">체크아웃</p>
            <p className="text-sm font-medium">날짜 선택</p>
          </div>
        </Button>
        <Button variant="outline" className="w-full justify-start rounded-xl h-auto p-3">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">인원</p>
            <p className="text-sm font-medium">성인 2명</p>
          </div>
        </Button>
      </div>

      <Button className="w-full rounded-xl" size="lg">
        객실 선택
      </Button>

      {/* Phone */}
      {accommodation.phoneNumber && (
        <Button variant="outline" className="w-full mt-3 gap-2 rounded-xl" asChild>
          <a href={`tel:${accommodation.phoneNumber}`}>
            <Phone className="size-4" />
            전화 문의
          </a>
        </Button>
      )}
    </div>
  )
}

function MobileBookingBar({ accommodation }: { accommodation: AccommodationDetail }) {
  const lowestStayPrice = Math.min(
    ...accommodation.rooms.filter((r) => r.stayAvailable).map((r) => r.stayPrice)
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] lg:hidden bg-background/95 backdrop-blur-md border-t px-4 py-3">
      <div className="flex items-center gap-3">
        {/* 전화 버튼 */}
        {accommodation.phoneNumber && (
          <Button variant="outline" size="icon" className="size-12 rounded-xl shrink-0" asChild>
            <a href={`tel:${accommodation.phoneNumber}`}>
              <Phone className="size-5" />
            </a>
          </Button>
        )}

        {/* 가격 */}
        <div className="flex-1 min-w-0">
          {accommodation.benefitPointRate > 0 && (
            <p className="text-xs text-primary font-medium">
              +{accommodation.benefitPointRate}% 적립
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">
              {lowestStayPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">원~/박</span>
          </div>
        </div>

        {/* 예약 버튼 */}
        <Button size="lg" className="px-6 rounded-xl shrink-0">
          객실 선택
        </Button>
      </div>
    </div>
  )
}
