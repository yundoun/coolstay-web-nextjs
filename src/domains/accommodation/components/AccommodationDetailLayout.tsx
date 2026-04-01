"use client"

import { useState, useMemo } from "react"
import { Coins, CalendarDays, Users, RefreshCw } from "lucide-react"
import { useSearchModal } from "@/lib/stores/search-modal"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "./ImageGallery"
import { AccommodationInfo } from "./AccommodationInfo"
import { AmenityList } from "./AmenityList"
import { BenefitSection } from "./BenefitSection"
import { ExtraServiceSection } from "./ExtraServiceSection"
import { RoomCard } from "./RoomCard"
import { ReviewSection } from "./ReviewSection"
import { PolicySection } from "./PolicySection"
import { MapSection } from "./MapSection"
import { EventBanner } from "./EventBanner"
import { BusinessInfoSection } from "./BusinessInfoSection"
import { ExternalLinkSection } from "./ExternalLinkSection"
import { RoomDetailModal } from "./RoomDetailModal"
import { RentalTimeModal } from "./RentalTimeModal"
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [rentalRoom, setRentalRoom] = useState<Room | null>(null)
  const [rentalModalOpen, setRentalModalOpen] = useState(false)

  // Rooms with date-based price variation
  const adjustedRooms = useMemo(() => {
    if (dateSeed === 0) return accommodation.rooms
    return applyDateVariation(accommodation.rooms, dateSeed)
  }, [accommodation.rooms, dateSeed])

  // SearchModal에서 날짜 변경 시 store 업데이트 → 추후 API 재조회 연동
  const modalCheckIn = useSearchModal((s) => s.checkIn)
  const modalCheckOut = useSearchModal((s) => s.checkOut)

  // SearchModal에서 날짜가 변경되면 반영
  useMemo(() => {
    if (modalCheckIn) setCheckIn(modalCheckIn)
    if (modalCheckOut) setCheckOut(modalCheckOut)
  }, [modalCheckIn, modalCheckOut])

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

            {/* 혜택/쿠폰 섹션 */}
            <BenefitSection accommodation={accommodation} />

            {/* 부가 서비스 */}
            <ExtraServiceSection accommodation={accommodation} />

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
                    onDetailClick={(r) => {
                      setSelectedRoom(r)
                      setRoomModalOpen(true)
                    }}
                    onRentalClick={(r) => {
                      setRentalRoom(r)
                      setRentalModalOpen(true)
                    }}
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

            {/* 외부 링크 */}
            <ExternalLinkSection accommodation={accommodation} />

            {/* 사업자 정보 */}
            <BusinessInfoSection accommodation={accommodation} />

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
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Bottom Bar */}
      <MobileBookingBar accommodation={accommodation} />

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        accommodationId={accommodation.id}
        open={roomModalOpen}
        onOpenChange={setRoomModalOpen}
      />

      {/* Rental Time Selection Modal */}
      <RentalTimeModal
        open={rentalModalOpen}
        onOpenChange={setRentalModalOpen}
        accommodationId={accommodation.id}
        roomId={rentalRoom?.id ?? ""}
        roomName={rentalRoom?.name ?? ""}
        price={rentalRoom?.rentalPrice ?? 0}
      />
    </div>
  )
}

function BookingWidget({
  accommodation,
  rooms,
  checkIn,
  checkOut,
}: {
  accommodation: AccommodationDetail
  rooms: Room[]
  checkIn: Date
  checkOut: Date
}) {
  const openModal = useSearchModal((s) => s.open)
  const adults = useSearchModal((s) => s.adults)
  const kids = useSearchModal((s) => s.kids)

  const lowestStayPrice = Math.min(
    ...rooms.filter((r) => r.stayAvailable).map((r) => r.stayPrice)
  )
  const lowestOriginal = accommodation.rooms.find(
    (r) => r.stayPrice === Math.min(...accommodation.rooms.filter((r2) => r2.stayAvailable).map((r2) => r2.stayPrice))
  )?.stayOriginalPrice

  const discount = lowestOriginal
    ? Math.round(((lowestOriginal - lowestStayPrice) / lowestOriginal) * 100)
    : null

  const guestLabel = kids > 0 ? `성인 ${adults}, 아동 ${kids}` : `성인 ${adults}명`

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

      {/* Date/Guest Selection — 클릭 시 SearchModal 오픈 */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-start rounded-xl h-auto p-3"
            onClick={() => openModal("date")}
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
            onClick={() => openModal("date")}
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
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl h-auto p-3"
          onClick={() => openModal("guest")}
        >
          <div className="text-left flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">인원</p>
              <p className="text-sm font-medium">{guestLabel}</p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}

function MobileBookingBar({ accommodation }: { accommodation: AccommodationDetail }) {
  const openModal = useSearchModal((s) => s.open)
  const lowestStayPrice = Math.min(
    ...accommodation.rooms.filter((r) => r.stayAvailable).map((r) => r.stayPrice)
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] lg:hidden bg-background/95 backdrop-blur-md border-t px-4 py-3">
      <div className="flex items-center gap-3">
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

        {/* 날짜 변경 */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1.5 shrink-0"
          onClick={() => openModal("date")}
        >
          <CalendarDays className="size-4" />
          날짜 변경
        </Button>
      </div>
    </div>
  )
}
