"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Coins, CalendarDays, Users, Loader2 } from "lucide-react"
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
  onApply: (checkIn: Date, checkOut: Date) => void
  isRefetching?: boolean
}

function formatDate(date: Date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
  return `${month}/${day} (${weekdays[date.getDay()]})`
}

/** 선택 인원으로 수용 가능한 객실만 필터 */
function filterRoomsByGuests(rooms: Room[], adults: number, kids: number): Room[] {
  return rooms.filter((room) => adults + kids <= room.maxGuests)
}

export function AccommodationDetailLayout({
  accommodation,
  onApply,
  isRefetching,
}: AccommodationDetailLayoutProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [appliedAdults, setAppliedAdults] = useState(2)
  const [appliedKids, setAppliedKids] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [rentalRoom, setRentalRoom] = useState<Room | null>(null)
  const [rentalModalOpen, setRentalModalOpen] = useState(false)

  // SearchModal 전역 상태
  const modalCheckIn = useSearchModal((s) => s.checkIn)
  const modalCheckOut = useSearchModal((s) => s.checkOut)
  const modalAdults = useSearchModal((s) => s.adults)
  const modalKids = useSearchModal((s) => s.kids)
  const setOnApply = useSearchModal((s) => s.setOnApply)

  // 모달 적용 콜백 등록 — 모달에서 "적용하기" 클릭 시 재조회
  const stateRef = useRef({ checkIn, checkOut, modalAdults, modalKids })
  stateRef.current = { checkIn, checkOut, modalAdults, modalKids }

  useEffect(() => {
    setOnApply(() => {
      const { checkIn: ci, checkOut: co, modalAdults: a, modalKids: k } = stateRef.current
      // 날짜 동기화 후 API 재조회
      const effectiveCheckIn = useSearchModal.getState().checkIn ?? ci
      const effectiveCheckOut = useSearchModal.getState().checkOut ?? co
      const effectiveAdults = useSearchModal.getState().adults
      const effectiveKids = useSearchModal.getState().kids

      setCheckIn(effectiveCheckIn)
      setCheckOut(effectiveCheckOut)
      setAppliedAdults(effectiveAdults)
      setAppliedKids(effectiveKids)
      onApply(effectiveCheckIn, effectiveCheckOut)
    })
    return () => setOnApply(null)
  }, [onApply, setOnApply])

  // 인원 기반 필터링된 객실
  const availableRooms = useMemo(
    () => filterRoomsByGuests(accommodation.rooms, appliedAdults, appliedKids),
    [accommodation.rooms, appliedAdults, appliedKids],
  )

  const guestLabel = appliedKids > 0
    ? `성인 ${appliedAdults}, 아동 ${appliedKids}`
    : `성인 ${appliedAdults}명`

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
                <p className="text-sm text-muted-foreground">
                  {availableRooms.length === accommodation.rooms.length
                    ? `총 ${accommodation.rooms.length}개`
                    : `${accommodation.rooms.length}개 중 ${availableRooms.length}개 예약 가능`}
                </p>
              </div>
              <div
                className={`space-y-4 transition-opacity duration-300 ${
                  isRefetching ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
              >
                {isRefetching && (
                  <div className="flex items-center justify-center py-8 gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    <span>객실 정보를 업데이트하고 있습니다</span>
                  </div>
                )}
                {!isRefetching && availableRooms.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="size-10 text-muted-foreground/40 mb-3" />
                    <p className="text-base font-medium text-muted-foreground">
                      선택 인원을 수용할 수 있는 객실이 없습니다
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      인원 수를 줄여서 다시 검색해 보세요
                    </p>
                  </div>
                )}
                {availableRooms.map((room) => (
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
                rooms={availableRooms}
                allRoomsCount={accommodation.rooms.length}
                checkIn={checkIn}
                checkOut={checkOut}
                guestLabel={guestLabel}
                isRefetching={isRefetching}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Bottom Bar */}
      <MobileBookingBar
        accommodation={accommodation}
        availableRooms={availableRooms}
        checkIn={checkIn}
        guestLabel={guestLabel}
      />

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
  allRoomsCount,
  checkIn,
  checkOut,
  guestLabel,
  isRefetching,
}: {
  accommodation: AccommodationDetail
  rooms: Room[]
  allRoomsCount: number
  checkIn: Date
  checkOut: Date
  guestLabel: string
  isRefetching?: boolean
}) {
  const openModal = useSearchModal((s) => s.open)

  const stayRooms = rooms.filter((r) => r.stayAvailable)
  const lowestStayPrice = stayRooms.length > 0
    ? Math.min(...stayRooms.map((r) => r.stayPrice))
    : null

  const lowestOriginal = lowestStayPrice != null
    ? accommodation.rooms.find(
        (r) => r.stayPrice === Math.min(...accommodation.rooms.filter((r2) => r2.stayAvailable).map((r2) => r2.stayPrice))
      )?.stayOriginalPrice
    : undefined

  const discount = lowestOriginal && lowestStayPrice
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
        {lowestStayPrice != null ? (
          <>
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
          </>
        ) : (
          <p className="text-sm text-muted-foreground">예약 가능한 객실이 없습니다</p>
        )}
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

      {/* 로딩 표시 */}
      {isRefetching && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>가격 업데이트 중...</span>
        </div>
      )}

      {/* 필터 결과 안내 */}
      {rooms.length < allRoomsCount && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          {guestLabel} 기준 {allRoomsCount}개 중 {rooms.length}개 객실 이용 가능
        </p>
      )}
    </div>
  )
}

function MobileBookingBar({
  accommodation,
  availableRooms,
  checkIn,
  guestLabel,
}: {
  accommodation: AccommodationDetail
  availableRooms: Room[]
  checkIn: Date
  guestLabel: string
}) {
  const openModal = useSearchModal((s) => s.open)

  const stayRooms = availableRooms.filter((r) => r.stayAvailable)
  const lowestStayPrice = stayRooms.length > 0
    ? Math.min(...stayRooms.map((r) => r.stayPrice))
    : null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] lg:hidden bg-background/95 backdrop-blur-md border-t px-4 py-3">
      <div className="flex items-center gap-2">
        {/* 가격 */}
        <div className="flex-1 min-w-0">
          {lowestStayPrice != null ? (
            <>
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
            </>
          ) : (
            <p className="text-sm text-muted-foreground">예약 가능 객실 없음</p>
          )}
        </div>

        {/* 날짜 변경 */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1 shrink-0"
          onClick={() => openModal("date")}
        >
          <CalendarDays className="size-3.5" />
          <span className="text-xs">{formatDate(checkIn)}</span>
        </Button>

        {/* 인원 변경 */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1 shrink-0"
          onClick={() => openModal("guest")}
        >
          <Users className="size-3.5" />
          <span className="text-xs">{guestLabel}</span>
        </Button>
      </div>
    </div>
  )
}
