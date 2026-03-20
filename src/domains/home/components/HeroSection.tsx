"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, CalendarDays, Users, Ticket, Zap, ChevronRight, Flame } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { useSearchModal, type SearchStep } from "@/lib/stores/search-modal"
import { cn } from "@/lib/utils"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(d: Date) {
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
}

function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── 꿀딜 목데이터 ──────────────────────────────────────────

interface HoneyDeal {
  id: string
  accommodationId: string
  name: string
  location: string
  imageUrl: string
  originalPrice: number
  step1Price: number
  step1Label: string
  step2Discount: number
  step2Label: string
  step3Discount: number
  step3Label: string
  finalPrice: number
  discountRate: number
  remainingCoupons: number
  rating: number
  reviewCount: number
}

const honeyDeals: HoneyDeal[] = [
  {
    id: "d1",
    accommodationId: "1",
    name: "파라다이스 호텔 부산",
    location: "해운대",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    originalPrice: 250000,
    step1Price: 190000,
    step1Label: "주중 특가",
    step2Discount: 15000,
    step2Label: "선착순 쿠폰",
    step3Discount: 10000,
    step3Label: "내 쿠폰",
    finalPrice: 165000,
    discountRate: 34,
    remainingCoupons: 3,
    rating: 4.8,
    reviewCount: 2341,
  },
  {
    id: "d2",
    accommodationId: "2",
    name: "그랜드 하얏트 제주",
    location: "서귀포",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    originalPrice: 420000,
    step1Price: 350000,
    step1Label: "봄맞이 할인",
    step2Discount: 30000,
    step2Label: "선착순 쿠폰",
    step3Discount: 20000,
    step3Label: "내 쿠폰",
    finalPrice: 300000,
    discountRate: 29,
    remainingCoupons: 1,
    rating: 4.9,
    reviewCount: 1876,
  },
  {
    id: "d3",
    accommodationId: "3",
    name: "세인트존스 호텔",
    location: "강릉",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    originalPrice: 250000,
    step1Price: 198000,
    step1Label: "연박 할인",
    step2Discount: 10000,
    step2Label: "선착순 쿠폰",
    step3Discount: 8000,
    step3Label: "내 쿠폰",
    finalPrice: 180000,
    discountRate: 28,
    remainingCoupons: 5,
    rating: 4.7,
    reviewCount: 943,
  },
  {
    id: "d4",
    accommodationId: "1",
    name: "롯데호텔 서울",
    location: "서울 중구",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    originalPrice: 380000,
    step1Price: 320000,
    step1Label: "얼리버드",
    step2Discount: 20000,
    step2Label: "선착순 쿠폰",
    step3Discount: 15000,
    step3Label: "내 쿠폰",
    finalPrice: 285000,
    discountRate: 25,
    remainingCoupons: 2,
    rating: 4.6,
    reviewCount: 3201,
  },
]

// ─── 컴포넌트 ───────────────────────────────────────────────

export function HeroSection() {
  const router = useRouter()
  const {
    open,
    selectedCity,
    selectedArea,
    checkIn,
    checkOut,
    adults,
    kids,
  } = useSearchModal()

  const locationDisplay = selectedArea || selectedCity || "지역, 숙소명 검색"
  const locationLabel = selectedCity ? "선택된 지역" : "어디로 떠나시나요?"

  let dateDisplay = "날짜 선택"
  if (checkIn && checkOut) {
    const nights = diffDays(checkIn, checkOut)
    dateDisplay = `${formatDateKr(checkIn)} - ${formatDateKr(checkOut)} · ${nights}박`
  } else if (checkIn) {
    dateDisplay = `${formatDateKr(checkIn)} - 체크아웃 선택`
  }
  const dateLabel = checkIn ? "선택된 날짜" : "날짜"

  const guestDisplay =
    kids > 0 ? `성인 ${adults}, 아동 ${kids}` : `성인 ${adults}명`

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.set("keyword", selectedArea || selectedCity)
    if (checkIn) {
      params.set("checkIn", `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, "0")}-${String(checkIn.getDate()).padStart(2, "0")}`)
    }
    if (checkOut) {
      params.set("checkOut", `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, "0")}-${String(checkOut.getDate()).padStart(2, "0")}`)
    }
    params.set("adults", String(adults))
    if (kids > 0) params.set("kids", String(kids))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section data-slot="hero-section">
      {/* 검색바 — 심플한 상단 배치 */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <Container size="normal" className="py-6 md:py-8">
          <div id="hero-search-bar">
            <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg border">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0 md:divide-x md:divide-border">
                <SearchField
                  icon={MapPin}
                  label={locationLabel}
                  value={locationDisplay}
                  highlighted={!!selectedCity}
                  className="md:flex-1 md:pr-4"
                  onClick={() => open("region")}
                />
                <SearchField
                  icon={CalendarDays}
                  label={dateLabel}
                  value={dateDisplay}
                  highlighted={!!checkIn}
                  className="md:flex-1 md:px-4"
                  onClick={() => open("date")}
                />
                <SearchField
                  icon={Users}
                  label="인원"
                  value={guestDisplay}
                  className="md:w-40 md:px-4"
                  onClick={() => open("guest")}
                />
                <div className="md:pl-4">
                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Search className="size-5" />
                    <span className="md:sr-only lg:not-sr-only">검색</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 꿀딜 섹션 */}
      <div className="bg-gradient-to-b from-amber-50 to-background">
        <Container size="wide" padding="responsive" className="py-8 md:py-10">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="size-5 text-orange-500" />
                <h2 className="text-xl md:text-2xl font-bold">오늘의 꿀딜</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                쿠폰 3장 겹쳐쓰면 이 가격! 선착순 마감 임박
              </p>
            </div>
            <Link
              href="/search?sort=price-asc"
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline shrink-0"
            >
              전체보기
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* 꿀딜 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {honeyDeals.map((deal) => (
              <HoneyDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

// ─── 꿀딜 카드 ──────────────────────────────────────────────

function HoneyDealCard({ deal }: { deal: HoneyDeal }) {
  return (
    <Link
      href={`/accommodations/${deal.accommodationId}`}
      className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all"
    >
      {/* 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={deal.imageUrl}
          alt={deal.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* 할인율 뱃지 */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold text-sm px-2.5 py-1">
            {deal.discountRate}%
          </Badge>
        </div>
        {/* 마감 임박 */}
        {deal.remainingCoupons <= 3 && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 text-red-500 border-red-200 text-xs font-semibold">
              <Zap className="size-3 mr-0.5" />
              {deal.remainingCoupons}장 남음
            </Badge>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs text-muted-foreground">{deal.location}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">⭐ {deal.rating}</span>
        </div>
        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
          {deal.name}
        </h3>

        {/* 3단 쿠폰 가격 브레이크다운 */}
        <div className="mt-3 space-y-1.5">
          {/* 기준가 */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground line-through">
              {deal.originalPrice.toLocaleString()}원
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{deal.step1Label}</Badge>
              <span className="text-muted-foreground">{deal.step1Price.toLocaleString()}원</span>
            </div>
          </div>

          {/* 선착순 쿠폰 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Ticket className="size-3 text-orange-500" />
              <span className="text-orange-600 font-medium">{deal.step2Label}</span>
            </div>
            <span className="text-red-500 font-semibold">-{deal.step2Discount.toLocaleString()}원</span>
          </div>

          {/* 내 쿠폰 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Ticket className="size-3 text-primary" />
              <span className="text-primary font-medium">{deal.step3Label}</span>
            </div>
            <span className="text-red-500 font-semibold">-{deal.step3Discount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 최종 가격 */}
        <div className="mt-3 pt-3 border-t flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">최종가</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">{deal.finalPrice.toLocaleString()}</span>
            <span className="text-sm font-semibold">원</span>
            <span className="text-xs text-muted-foreground">/박</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── 검색 필드 ──────────────────────────────────────────────

function SearchField({
  icon: Icon,
  label,
  value,
  highlighted,
  className,
  onClick,
}: {
  icon: React.ElementType
  label: string
  value: string
  highlighted?: boolean
  className?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3",
        "rounded-xl p-2 transition-colors hover:bg-muted/50",
        "md:rounded-none md:hover:bg-transparent",
        className
      )}
    >
      <Icon className={cn("size-5 shrink-0", highlighted ? "text-primary" : "text-muted-foreground")} />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={cn("truncate text-sm", highlighted ? "text-foreground font-semibold" : "text-foreground")}>
          {value}
        </p>
      </div>
    </button>
  )
}
