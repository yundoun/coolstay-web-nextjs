"use client"

import { useState, useMemo, useCallback } from "react"
import { Coins, CalendarDays, Users, Loader2 } from "lucide-react"
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
import { SectionTabNav, type SectionTab } from "./SectionTabNav"
import { DatePickerModal, GuestPickerModal } from "./DateGuestPicker"
import type { AccommodationDetail, Room } from "../types"

// ─── 유틸 (기존 동일) ───────────────────────────────────────

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

function formatDateShort(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
}

function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

/** 선택 인원으로 수용 가능한 객실만 필터 */
function filterRoomsByGuests(rooms: Room[], adults: number, kids: number): Room[] {
  return rooms.filter((room) => adults + kids <= room.maxGuests)
}

// ─── 탭 정의 ────────────────────────────────────────────────

const SECTION_TABS: SectionTab[] = [
  { id: "section-info", label: "숙소소개" },
  { id: "section-reviews", label: "후기요약" },
  { id: "section-rooms", label: "객실선택" },
  { id: "section-benefits", label: "혜택" },
  { id: "section-amenities", label: "시설/서비스" },
  { id: "section-location", label: "위치/교통" },
  { id: "section-policy", label: "이용안내" },
]

// ─── Main Layout ────────────────────────────────────────────

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
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [guestPickerOpen, setGuestPickerOpen] = useState(false)

  const handleDateApply = useCallback(
    (newCheckIn: Date, newCheckOut: Date) => {
      setCheckIn(newCheckIn)
      setCheckOut(newCheckOut)
      onApply(newCheckIn, newCheckOut)
    },
    [onApply],
  )

  const handleGuestApply = useCallback((newAdults: number, newKids: number) => {
    setAppliedAdults(newAdults)
    setAppliedKids(newKids)
  }, [])

  // 인원 기반 필터링된 객실
  const availableRooms = useMemo(
    () => filterRoomsByGuests(accommodation.rooms, appliedAdults, appliedKids),
    [accommodation.rooms, appliedAdults, appliedKids],
  )

  const nights = diffDays(checkIn, checkOut)
  const dateLabel = `${formatDateShort(checkIn)}~${formatDateShort(checkOut)}, ${nights}박`
  const guestLabel = appliedKids > 0
    ? `성인 ${appliedAdults}, 아동 ${appliedKids}`
    : `성인 ${appliedAdults}명`

  // ─── 섹션들 (기존 컴포넌트 그대로, id만 부여) ───

  const roomsContent = (
    <div id="section-rooms">
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
  )

  const reviewsContent = (
    <div id="section-reviews">
      <ReviewSection
        reviews={accommodation.reviews}
        bestReview={accommodation.bestReview}
        recentReviews={accommodation.recentReviews}
        accommodationId={accommodation.id}
      />
    </div>
  )

  const benefitsContent = (
    <div id="section-benefits">
      <BenefitSection accommodation={accommodation} />
      <ExtraServiceSection accommodation={accommodation} />
      {accommodation.events.length > 0 && (
        <div className="mt-8">
          <EventBanner events={accommodation.events} />
        </div>
      )}
    </div>
  )

  const amenitiesContent = (
    <div id="section-amenities">
      <AmenityList amenities={accommodation.amenities} />
    </div>
  )

  const locationContent = (
    <div id="section-location">
      <MapSection
        address={accommodation.address}
        name={accommodation.name}
        latitude={accommodation.latitude}
        longitude={accommodation.longitude}
      />
    </div>
  )

  const policyContent = (
    <div id="section-policy">
      <PolicySection policies={accommodation.policies} />
      <Separator className="my-8" />
      <ExternalLinkSection accommodation={accommodation} />
      <BusinessInfoSection accommodation={accommodation} />
    </div>
  )

  // 날짜/인원 pill 버튼 (모바일/PC 공용)
  const pillButtons = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setDatePickerOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium hover:bg-muted transition-colors"
      >
        <CalendarDays className="size-3.5 text-muted-foreground" />
        <span>{dateLabel}</span>
      </button>
      <button
        onClick={() => setGuestPickerOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium hover:bg-muted transition-colors"
      >
        <Users className="size-3.5 text-muted-foreground" />
        <span>{guestLabel}</span>
      </button>
      {isRefetching && <Loader2 className="size-4 animate-spin text-muted-foreground ml-1" />}
    </div>
  )

  // 숙소소개 섹션 (탭 스크롤 대상)
  const infoContent = (
    <div id="section-info">
      <AccommodationInfo accommodation={accommodation} />
    </div>
  )

  // 섹션 순서: 숙소소개 → 리뷰 → 객실 → 혜택 → 시설/서비스 → 위치 → 이용안내
  const orderedSections = (
    <div className="space-y-8">
      {infoContent}
      <Separator />
      {reviewsContent}
      <Separator />
      {roomsContent}
      <Separator />
      {benefitsContent}
      <Separator />
      {amenitiesContent}
      <Separator />
      {locationContent}
      <Separator />
      {policyContent}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* ─── 이미지 갤러리 (공통) ─── */}
      <Container size="wide" padding="responsive" className="pt-4">
        <ImageGallery images={accommodation.images} name={accommodation.name} />
      </Container>

      {/* ════════════════════════════════════════════════════════
          모바일 레이아웃
          - MobileBookingBar 제거 → sticky 탭 + pill 버튼
          ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Sticky 탭 네비게이션 */}
        <SectionTabNav tabs={SECTION_TABS} stickyTop={56} className="mt-4" />

        {/* 날짜/인원 pill 버튼 (탭 아래 sticky) */}
        <div
          className="sticky bg-background z-[calc(var(--z-sticky,30)-1)] border-b"
          style={{ top: 56 + 44 }}
        >
          <Container size="normal" padding="responsive">
            <div className="py-2.5">{pillButtons}</div>
          </Container>
        </div>

        {/* 콘텐츠 */}
        <Container size="normal" padding="responsive" className="mt-6 pb-16">
          {orderedSections}
        </Container>
      </div>

      {/* ════════════════════════════════════════════════════════
          PC 레이아웃
          - 기존 2-column 그리드 유지
          - 좌측 콘텐츠에 탭 추가
          - 우측 BookingWidget 유지
          ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">
        <Container size="normal" padding="responsive" className="mt-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: Main Content (col-span-2) */}
            <div className="col-span-2">
              {/* 탭 바 — 좌측 콘텐츠 내부 */}
              <SectionTabNav tabs={SECTION_TABS} stickyTop={80} />

              {/* 날짜/인원 pill */}
              <div className="py-3 mt-2">{pillButtons}</div>

              {/* 콘텐츠 */}
              <div className="mt-4">{orderedSections}</div>
            </div>

            {/* Right: Sticky Booking Widget (기존 그대로) */}
            <div>
              <div className="sticky top-24">
                <BookingWidget
                  accommodation={accommodation}
                  rooms={availableRooms}
                  allRoomsCount={accommodation.rooms.length}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guestLabel={guestLabel}
                  isRefetching={isRefetching}
                  onDateClick={() => setDatePickerOpen(true)}
                  onGuestClick={() => setGuestPickerOpen(true)}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Modals (공통) ─── */}
      <RoomDetailModal
        room={selectedRoom}
        accommodationId={accommodation.id}
        open={roomModalOpen}
        onOpenChange={setRoomModalOpen}
      />
      <RentalTimeModal
        open={rentalModalOpen}
        onOpenChange={setRentalModalOpen}
        accommodationId={accommodation.id}
        roomId={rentalRoom?.id ?? ""}
        roomName={rentalRoom?.name ?? ""}
        price={rentalRoom?.rentalPrice ?? 0}
      />
      {datePickerOpen && (
        <DatePickerModal
          checkIn={checkIn}
          checkOut={checkOut}
          onApply={handleDateApply}
          onClose={() => setDatePickerOpen(false)}
        />
      )}
      {guestPickerOpen && (
        <GuestPickerModal
          adults={appliedAdults}
          kids={appliedKids}
          onApply={handleGuestApply}
          onClose={() => setGuestPickerOpen(false)}
        />
      )}
    </div>
  )
}

// ─── BookingWidget (PC 우측, 기존 동일 — SearchModal 대신 콜백) ───

function BookingWidget({
  accommodation,
  rooms,
  allRoomsCount,
  checkIn,
  checkOut,
  guestLabel,
  isRefetching,
  onDateClick,
  onGuestClick,
}: {
  accommodation: AccommodationDetail
  rooms: Room[]
  allRoomsCount: number
  checkIn: Date
  checkOut: Date
  guestLabel: string
  isRefetching?: boolean
  onDateClick: () => void
  onGuestClick: () => void
}) {
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

      {/* Date/Guest Selection */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-start rounded-xl h-auto p-3"
            onClick={onDateClick}
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
            onClick={onDateClick}
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
          onClick={onGuestClick}
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
