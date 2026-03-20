"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Container } from "@/components/layout"
import { useSearchModal, type SearchStep } from "@/lib/stores/search-modal"
import { heroBackgrounds } from "../data/mock"
import { cn } from "@/lib/utils"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(d: Date) {
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
}

function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

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

  // 검색바에 표시할 값
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
  const guestLabel = "인원"

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) {
      params.set("keyword", selectedArea || selectedCity)
    }
    if (checkIn) {
      params.set(
        "checkIn",
        `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, "0")}-${String(checkIn.getDate()).padStart(2, "0")}`
      )
    }
    if (checkOut) {
      params.set(
        "checkOut",
        `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, "0")}-${String(checkOut.getDate()).padStart(2, "0")}`
      )
    }
    params.set("adults", String(adults))
    if (kids > 0) params.set("kids", String(kids))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section
      data-slot="hero-section"
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgrounds[0]}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      <Container size="normal" className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl">
            <span className="text-primary">꿀</span>같은 휴식을 선물하세요
          </h1>
          <p className="mt-3 text-base text-white/90 drop-shadow md:mt-4 md:text-lg">
            전국 5,000개 이상의 엄선된 숙소에서 특별한 순간을 만나보세요
          </p>

          {/* 검색바 — 각 필드 클릭 시 해당 스텝 모달 오픈, 검색 버튼으로 이동 */}
          <div id="hero-search-bar" className="mt-8 md:mt-10">
            <div
              className={cn(
                "w-full glass-search rounded-xl p-3 md:p-4 shadow-2xl",
                "border border-white/30",
                "text-left"
              )}
            >
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
                  label={guestLabel}
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
        </div>
      </Container>
    </section>
  )
}

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
        "rounded-xl p-2 transition-colors hover:bg-muted/30",
        "md:rounded-none md:hover:bg-transparent",
        className
      )}
    >
      <Icon className={cn("size-5 shrink-0", highlighted ? "text-primary" : "text-muted-foreground")} />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={cn("truncate text-sm", highlighted ? "text-white font-semibold" : "text-foreground")}>
          {value}
        </p>
      </div>
    </button>
  )
}
