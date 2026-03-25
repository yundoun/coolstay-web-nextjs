"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Container } from "@/components/layout"
import { useSearchModal, type SearchStep } from "@/lib/stores/search-modal"
import { cn } from "@/lib/utils"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(d: Date) {
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
}

function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

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
      {/* 컴팩트 히어로 비주얼 */}
      <div className="relative h-[180px] md:h-[220px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=400&fit=crop"
          alt="꿀스테이 히어로"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <Container size="normal" className="relative h-full flex flex-col justify-center">
          <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
            꿀같은 휴식을 선물하세요
          </h1>
          <p className="text-white/80 text-sm mt-1 drop-shadow">
            전국 5,000개 이상의 엄선된 숙소
          </p>
        </Container>
      </div>

      {/* 검색바 — 히어로 하단에 겹치게 배치 */}
      <div className="relative -mt-7 z-10">
        <Container size="normal">
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

    </section>
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
