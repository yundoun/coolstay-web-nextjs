"use client"

import Image from "next/image"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { getRegionImage } from "../data/regionImages"

interface SearchHeroSectionProps {
  region?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

export function SearchHeroSection({
  region,
  checkIn,
  checkOut,
  guests = 2,
}: SearchHeroSectionProps) {
  const regionData = getRegionImage(region)

  return (
    <section
      data-slot="search-hero-section"
      className="relative min-h-[40vh] md:min-h-[45vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src={regionData.heroImage}
          alt={`${regionData.label} 배경`}
          fill
          priority
          className="object-cover scale-105 animate-slow-zoom"
          sizes="100vw"
        />
        {/* Gradient Overlay - More cinematic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
      </div>

      {/* Content */}
      <Container size="normal" className="relative z-10 py-8 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* Region Label */}
          {region && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <MapPin className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                {regionData.label}
              </span>
            </div>
          )}

          {/* Title with Animation */}
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-3xl lg:text-4xl animate-fade-in">
            {regionData.description}
          </h1>

          {/* Glassmorphism Search Bar */}
          <div className="mt-6 md:mt-8">
            <CompactSearchBar
              region={region}
              regionLabel={regionData.label}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

interface CompactSearchBarProps {
  region?: string
  regionLabel: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

function CompactSearchBar({
  region,
  regionLabel,
  checkIn,
  checkOut,
  guests = 2,
}: CompactSearchBarProps) {
  const dateDisplay = checkIn && checkOut
    ? `${checkIn} - ${checkOut}`
    : "날짜 선택"

  return (
    <div
      className={cn(
        "rounded-2xl p-2 md:p-3 shadow-2xl",
        "border border-border/50",
        "backdrop-blur-xl bg-background/95"
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
        {/* Location */}
        <SearchField
          icon={MapPin}
          value={region ? regionLabel : "어디로?"}
          className="md:flex-1 md:border-r md:border-border"
        />

        {/* Date */}
        <SearchField
          icon={CalendarDays}
          value={dateDisplay}
          className="md:flex-1 md:border-r md:border-border"
        />

        {/* Guests */}
        <SearchField
          icon={Users}
          value={`성인 ${guests}명`}
          className="md:w-32"
        />

        {/* Search Button */}
        <div className="md:pl-2">
          <Button
            size="lg"
            className={cn(
              "w-full gap-2 rounded-xl md:w-auto",
              "bg-primary hover:bg-primary/90",
              "shadow-lg shadow-primary/25",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <Search className="size-5" />
            <span className="md:sr-only lg:not-sr-only">검색</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

interface SearchFieldProps {
  icon: React.ElementType
  value: string
  className?: string
}

function SearchField({ icon: Icon, value, className }: SearchFieldProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-left",
        "rounded-xl transition-all duration-200",
        "hover:bg-muted",
        className
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate text-sm font-medium text-foreground">{value}</span>
    </button>
  )
}
