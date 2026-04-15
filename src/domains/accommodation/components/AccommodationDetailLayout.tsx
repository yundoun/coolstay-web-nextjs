"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Coins, CalendarDays, Users, Loader2, MessageCircle, Gift, Ticket, Star, Crown, Percent, Zap, ChevronDown, ChevronUp } from "lucide-react"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ImageGallery } from "./ImageGallery"
import { AccommodationInfo } from "./AccommodationInfo"
import { AmenityList } from "./AmenityList"
import { BenefitSection } from "./BenefitSection"
import { ExtraServiceSection } from "./ExtraServiceSection"
import { RoomCard } from "./RoomCard"
import { ReviewSection } from "./ReviewSection"
import { PolicySection } from "./PolicySection"
import { MapSection } from "./MapSection"

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
function filterRoomsByGuests(rooms: Room[], adults: number): Room[] {
  return rooms.filter((room) => adults <= room.maxGuests)
}

// ─── 탭 정의 ────────────────────────────────────────────────

const SECTION_TABS: SectionTab[] = [
  { id: "section-reviews", label: "리뷰" },
  { id: "section-benefits", label: "꿀혜택", mobileOnly: true },
  { id: "section-rooms", label: "객실선택" },
  { id: "section-intro", label: "숙소소개" },
  { id: "section-amenities", label: "시설/서비스" },
  { id: "section-location", label: "위치/교통" },
  { id: "section-etc", label: "기타" },
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [rentalRoom, setRentalRoom] = useState<Room | null>(null)
  const [rentalModalOpen, setRentalModalOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [guestPickerOpen, setGuestPickerOpen] = useState(false)
  const [showSubNav, setShowSubNav] = useState(false)

  // 스크롤 시 서브 네비 표시 (최상위에서는 숨김)
  useEffect(() => {
    const handleScroll = () => {
      setShowSubNav(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDateApply = useCallback(
    (newCheckIn: Date, newCheckOut: Date) => {
      setCheckIn(newCheckIn)
      setCheckOut(newCheckOut)
      onApply(newCheckIn, newCheckOut)
    },
    [onApply],
  )

  const handleGuestApply = useCallback((newAdults: number) => {
    setAppliedAdults(newAdults)
  }, [])

  // 인원 기반 필터링된 객실
  const availableRooms = useMemo(
    () => filterRoomsByGuests(accommodation.rooms, appliedAdults),
    [accommodation.rooms, appliedAdults],
  )

  const nights = diffDays(checkIn, checkOut)
  const dateLabel = `${formatDateShort(checkIn)}~${formatDateShort(checkOut)}, ${nights}박`
  const guestLabel = `성인 ${appliedAdults}명`

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
    </div>
  )

  const extraServiceContent = (
    <div>
      <ExtraServiceSection accommodation={accommodation} />
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

  const etcContent = (
    <div id="section-etc" className="space-y-8">
      <PolicySection policies={accommodation.policies} />
      <ExternalLinkSection accommodation={accommodation} />
      <BusinessInfoSection accommodation={accommodation} />
    </div>
  )

  // 날짜/인원 pill 버튼 (모바일: 균등 분배, PC: auto)
  const pillButtons = (
    <div className="flex items-center gap-2 lg:gap-2">
      <button
        onClick={() => setDatePickerOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 flex-1 lg:flex-none px-3.5 py-2 rounded-full border text-sm font-medium hover:bg-muted transition-colors"
      >
        <CalendarDays className="size-3.5 text-muted-foreground" />
        <span>{dateLabel}</span>
      </button>
      <button
        onClick={() => setGuestPickerOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 flex-1 lg:flex-none px-3.5 py-2 rounded-full border text-sm font-medium hover:bg-muted transition-colors"
      >
        <Users className="size-3.5 text-muted-foreground" />
        <span>{guestLabel}</span>
      </button>
      {isRefetching && <Loader2 className="size-4 animate-spin text-muted-foreground ml-1" />}
    </div>
  )

  // 상단 헤더 (태그, 숙소명, 주소, 평점, 액션 — 탭 밖)
  const infoContent = (
    <div>
      <AccommodationInfo accommodation={accommodation} />
    </div>
  )

  // 숙소 소개 (description + 사장님 인사말 — 탭 4번째)
  const introContent = (
    <div id="section-intro">
      <h2 className="text-xl font-semibold mb-4">숙소 소개</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {accommodation.description}
      </p>
      {accommodation.greetingMsg && (
        <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="size-4 text-primary" />
            <p className="text-sm font-semibold text-primary">사장님 인사말</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {accommodation.greetingMsg}
          </p>
        </div>
      )}
    </div>
  )

  // 섹션 순서: 헤더 → 리뷰 → 꿀혜택(모바일) → 객실 → 숙소소개 → 시설/서비스 → 위치 → 기타
  const orderedSections = (
    <div className="space-y-8">
      {infoContent}
      <Separator />
      {reviewsContent}
      {/* 꿀혜택: 모바일에서만 표시 (데스크톱은 사이드바 위젯으로 대체) */}
      <Separator className="lg:hidden" />
      <div className="lg:hidden">
        {benefitsContent}
      </div>
      <Separator />
      {roomsContent}
      {/* 부가 서비스: PC/모바일 모두 표시 */}
      {extraServiceContent}
      <Separator />
      {introContent}
      <Separator />
      {amenitiesContent}
      <Separator />
      {locationContent}
      <Separator />
      {etcContent}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* ─── 이미지 갤러리 ─── */}
      <div>
        <Container size="wide" padding="responsive" className="pt-4">
          <ImageGallery images={accommodation.images} name={accommodation.name} />
        </Container>
      </div>

      {/* ─── Slide-down 서브 네비 (탭 + pill) ───
          이미지가 뷰포트를 벗어나면 헤더 아래로 슬라이드 */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40",
          "top-14 md:top-[var(--header-height)]",
          "bg-background/95 backdrop-blur-md border-b border-border",
          "transition-[transform,opacity] duration-300 ease-out",
          showSubNav
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <Container size="normal" padding="responsive">
          {/* 1행: 탭 (스크롤 가능) */}
          <SectionTabNav
            tabs={SECTION_TABS}
            stickyTop={56}
            variant="inline"
            className="py-1.5"
          />
          {/* 2행: pill 버튼 */}
          <div className="pb-2">{pillButtons}</div>
        </Container>
      </div>

      {/* ─── 콘텐츠 영역 ─── */}
      <Container size="normal" padding="responsive" className="mt-6 pb-16">
        {/* 모바일: 1-column / PC: 2-column + 꿀혜택 사이드바 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {orderedSections}
          </div>

          {/* 꿀혜택 사이드바 (PC only) */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-height)+96px)]">
              <BenefitSidebarWidget accommodation={accommodation} />
            </div>
          </div>
        </div>
      </Container>

      {/* ─── Modals ─── */}
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
          onApply={handleGuestApply}
          onClose={() => setGuestPickerOpen(false)}
        />
      )}
    </div>
  )
}

// ─── 꿀혜택 사이드바 위젯 (PC 우측) ───

const SIDEBAR_FLAG_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  first_reserve: { label: "첫 예약 할인", icon: Star },
  low_price_korea: { label: "최저가 보장", icon: Crown },
  visit_korea: { label: "한국관광 인증", icon: Zap },
  favor_coupon_store: { label: "쿠폰 우대 숙소", icon: Ticket },
  unlimited_coupon: { label: "무제한 쿠폰", icon: Gift },
  revisit: { label: "재방문 혜택", icon: Percent },
}

function BenefitSidebarWidget({
  accommodation,
}: {
  accommodation: AccommodationDetail
}) {
  const {
    benefits,
    downloadCouponInfo,
    v2SupportFlag,
    consecutiveYn,
    benefitPointRate,
  } = accommodation

  const activeBenefits = benefits.filter((b) => b.active_yn === "Y")
  const hasCouponDownload =
    downloadCouponInfo && downloadCouponInfo.status !== "NON_TARGET"
  const activeSupportFlags = v2SupportFlag
    ? Object.entries(v2SupportFlag).filter(
        ([key, val]) => val === true && SIDEBAR_FLAG_LABELS[key]
      )
    : []
  const hasConsecutive = consecutiveYn === "Y"
  const hasMileage = benefitPointRate > 0

  const hasAnything =
    activeBenefits.length > 0 ||
    hasCouponDownload ||
    activeSupportFlags.length > 0 ||
    hasConsecutive ||
    hasMileage

  if (!hasAnything) return null

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">꿀혜택</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">이 숙소에서 받을 수 있는 혜택</p>
      </div>

      <div className="p-5 space-y-4">
        {/* 마일리지 적립 */}
        {hasMileage && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <Coins className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                +{benefitPointRate}% 마일리지 적립
              </p>
              {accommodation.paymentBenefit?.benefit_more_yn === "Y" && (
                <p className="text-xs text-emerald-600 mt-0.5">추가 적립 가능</p>
              )}
            </div>
          </div>
        )}

        {/* 뱃지 그룹 */}
        <div className="flex flex-wrap gap-1.5">
          {hasCouponDownload && (
            <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-xs">
              <Ticket className="size-3" />
              쿠폰 다운로드
            </Badge>
          )}
          {hasConsecutive && (
            <Badge className="gap-1 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 text-xs">
              <Crown className="size-3" />
              연박 할인
            </Badge>
          )}
          {activeSupportFlags.map(([key]) => {
            const config = SIDEBAR_FLAG_LABELS[key]
            const Icon = config.icon
            return (
              <Badge
                key={key}
                className="gap-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 text-xs"
              >
                <Icon className="size-3" />
                {config.label}
              </Badge>
            )
          })}
        </div>

        {/* 혜택 카드 리스트 */}
        {activeBenefits.length > 0 && (
          <SidebarBenefitCards benefits={activeBenefits} />
        )}
      </div>
    </div>
  )
}

function SidebarBenefitCards({ benefits }: { benefits: AccommodationDetail["benefits"] }) {
  const sorted = [...benefits].sort((a, b) => a.priority - b.priority)
  const [expanded, setExpanded] = useState(false)
  const hasMore = sorted.length > 3
  const visible = expanded ? sorted : sorted.slice(0, 3)

  return (
    <div className="space-y-2">
      {visible.map((benefit, index) => (
        <div
          key={`${benefit.name}-${index}`}
          className="flex items-start gap-2.5 p-3 rounded-lg border bg-muted/30"
        >
          {benefit.image_url ? (
            <img
              src={benefit.image_url}
              alt={benefit.name}
              className="size-7 rounded-md object-cover shrink-0"
            />
          ) : (
            <Gift className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight">{benefit.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {benefit.description}
            </p>
          </div>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>접기 <ChevronUp className="size-3.5" /></>
          ) : (
            <>+{sorted.length - 3}개 혜택 더보기 <ChevronDown className="size-3.5" /></>
          )}
        </button>
      )}
    </div>
  )
}
