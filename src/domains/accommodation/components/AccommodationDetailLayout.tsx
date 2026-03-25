"use client"

import { useState, useMemo, useCallback } from "react"
import { Phone, Coins, CalendarDays, RefreshCw } from "lucide-react"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "./ImageGallery"
import { AccommodationInfo } from "./AccommodationInfo"
import { AmenityList } from "./AmenityList"
import { RoomCard } from "./RoomCard"
import { ReviewSection } from "./ReviewSection"
import { PolicySection } from "./PolicySection"
import { MapSection } from "./MapSection"
import { EventBanner } from "./EventBanner"
import type { AccommodationDetail, Room } from "../types"

interface AccommodationDetailLayoutProps {
  accommodation: AccommodationDetail
}

// Apply a date-based price variation to simulate server refresh
function applyDateVariation(rooms: Room[], seed: number): Room[] {
  return rooms.map((room, i) => {
    // Deterministic variation based on seed and room index
    const factor = 1 + ((((seed * 7 + i * 13) % 20) - 10) / 100) // -10% to +10%
    return {
      ...room,
      stayPrice: Math.round(room.stayPrice * factor),
      rentalPrice: room.rentalPrice ? Math.round(room.rentalPrice * factor) : undefined,
    }
  })
}

function formatDate(date: Date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
  return `${month}/${day} (${weekdays[date.getDay()]})`
}

export function AccommodationDetailLayout({
  accommodation,
}: AccommodationDetailLayoutProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dateSeed, setDateSeed] = useState(0)

  // Rooms with date-based price variation
  const adjustedRooms = useMemo(() => {
    if (dateSeed === 0) return accommodation.rooms
    return applyDateVariation(accommodation.rooms, dateSeed)
  }, [accommodation.rooms, dateSeed])

  const handleDateChange = useCallback((direction: "next" | "prev") => {
    setIsRefreshing(true)
    const days = direction === "next" ? 1 : -1

    setCheckIn((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + days)
      return d
    })
    setCheckOut((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + days)
      return d
    })

    // Generate new seed for price variation
    setDateSeed((prev) => prev + 1)

    // Visual feedback
    setTimeout(() => setIsRefreshing(false), 300)
  }, [])

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">객실 선택</h2>
                {dateSeed > 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <RefreshCw className="size-3" />
                    <span>가격이 업데이트되었습니다</span>
                  </div>
                )}
              </div>
              <div
                className={`space-y-4 transition-opacity duration-300 ${
                  isRefreshing ? "opacity-50" : "opacity-100"
                }`}
              >
                {adjustedRooms.map((room) => (
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

            <Separator />

            <MapSection
              address={accommodation.address}
              name={accommodation.name}
              latitude={accommodation.latitude}
              longitude={accommodation.longitude}
            />
          </div>

          {/* Right: Sticky Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingWidget
                accommodation={accommodation}
                rooms={adjustedRooms}
                checkIn={checkIn}
                checkOut={checkOut}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Bottom Bar */}
      <MobileBookingBar accommodation={accommodation} />
    </div>
  )
}

function BookingWidget({
  accommodation,
  rooms,
  checkIn,
  checkOut,
  onDateChange,
}: {
  accommodation: AccommodationDetail
  rooms: Room[]
  checkIn: Date
  checkOut: Date
  onDateChange: (direction: "next" | "prev") => void
}) {
  const lowestStayPrice = Math.min(
    ...rooms.filter((r) => r.stayAvailable).map((r) => r.stayPrice)
  )
  const lowestOriginal = accommodation.rooms.find(
    (r) => r.stayPrice === Math.min(...accommodation.rooms.filter((r2) => r2.stayAvailable).map((r2) => r2.stayPrice))
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-start rounded-xl h-auto p-3"
            onClick={() => onDateChange("prev")}
          >
            <div className="text-left flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">체크인</p>
                <p className="text-sm font-medium">{formatDate(checkIn)}</p>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-start rounded-xl h-auto p-3"
            onClick={() => onDateChange("next")}
          >
            <div className="text-left flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">체크아웃</p>
                <p className="text-sm font-medium">{formatDate(checkOut)}</p>
              </div>
            </div>
          </Button>
        </div>
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
