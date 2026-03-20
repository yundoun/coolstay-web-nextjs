"use client"

import Image from "next/image"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { useSearchModal } from "@/lib/stores/search-modal"
import { heroBackgrounds } from "../data/mock"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { open } = useSearchModal()

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

          {/* 검색바 — 클릭 시 모달 오픈. id로 IntersectionObserver 감시 */}
          <div id="hero-search-bar" className="mt-8 md:mt-10">
            <button
              onClick={open}
              className={cn(
                "w-full glass-search rounded-xl p-3 md:p-4 shadow-2xl",
                "border border-white/30",
                "transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]",
                "text-left cursor-pointer"
              )}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0 md:divide-x md:divide-border">
                <SearchField icon={MapPin} label="어디로 떠나시나요?" value="지역, 숙소명 검색" className="md:flex-1 md:pr-4" />
                <SearchField icon={CalendarDays} label="날짜" value="날짜 선택" className="md:flex-1 md:px-4" />
                <SearchField icon={Users} label="인원" value="성인 2명" className="md:w-40 md:px-4" />
                <div className="md:pl-4">
                  <div className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
                    <Search className="size-5" />
                    <span className="md:sr-only lg:not-sr-only">검색</span>
                  </div>
                </div>
              </div>
            </button>
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
  className,
}: {
  icon: React.ElementType
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "rounded-xl p-2",
        "md:rounded-none",
        className
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm text-foreground">{value}</p>
      </div>
    </div>
  )
}
