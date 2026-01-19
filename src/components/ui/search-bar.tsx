"use client"

import Link from "next/link"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SearchBarProps {
  variant?: "hero" | "compact"
  location?: string
  locationLabel?: string
  locationPlaceholder?: string
  date?: string
  dateLabel?: string
  datePlaceholder?: string
  guests?: string
  guestsLabel?: string
  guestsPlaceholder?: string
  href?: string
  onSearch?: () => void
  className?: string
}

export function SearchBar({
  variant = "hero",
  location,
  locationLabel = "어디로 떠나시나요?",
  locationPlaceholder = "지역, 숙소명 검색",
  date,
  dateLabel = "날짜",
  datePlaceholder = "날짜 선택",
  guests,
  guestsLabel = "인원",
  guestsPlaceholder = "성인 2명",
  href = "/search2",
  onSearch,
  className,
}: SearchBarProps) {
  if (variant === "compact") {
    return (
      <CompactSearchBarContent
        location={location || "어디로"}
        date={date || "날짜"}
        guests={guests || "인원"}
        href={href}
        className={className}
      />
    )
  }

  return (
    <HeroSearchBarContent
      location={location}
      locationLabel={locationLabel}
      locationPlaceholder={locationPlaceholder}
      date={date}
      dateLabel={dateLabel}
      datePlaceholder={datePlaceholder}
      guests={guests}
      guestsLabel={guestsLabel}
      guestsPlaceholder={guestsPlaceholder}
      href={href}
      onSearch={onSearch}
      className={className}
    />
  )
}

interface HeroSearchBarContentProps {
  location?: string
  locationLabel: string
  locationPlaceholder: string
  date?: string
  dateLabel: string
  datePlaceholder: string
  guests?: string
  guestsLabel: string
  guestsPlaceholder: string
  href: string
  onSearch?: () => void
  className?: string
}

function HeroSearchBarContent({
  location,
  locationLabel,
  locationPlaceholder,
  date,
  dateLabel,
  datePlaceholder,
  guests,
  guestsLabel,
  guestsPlaceholder,
  href,
  onSearch,
  className,
}: HeroSearchBarContentProps) {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch()
    }
  }

  return (
    <div
      data-slot="search-bar"
      className={cn(
        "glass-search rounded-2xl p-3 md:p-4 shadow-2xl",
        "border border-white/30",
        className
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0 md:divide-x md:divide-border">
        {/* Location */}
        <SearchField
          icon={MapPin}
          label={locationLabel}
          value={location}
          placeholder={locationPlaceholder}
          className="md:flex-1 md:pr-4"
        />

        {/* Date */}
        <SearchField
          icon={CalendarDays}
          label={dateLabel}
          value={date}
          placeholder={datePlaceholder}
          className="md:flex-1 md:px-4"
        />

        {/* Guests */}
        <SearchField
          icon={Users}
          label={guestsLabel}
          value={guests}
          placeholder={guestsPlaceholder}
          className="md:w-40 md:px-4"
        />

        {/* Search Button */}
        <div className="md:pl-4">
          {onSearch ? (
            <Button
              size="lg"
              className="w-full gap-2 rounded-xl md:w-auto"
              onClick={handleSearchClick}
            >
              <Search className="size-5" />
              <span className="md:sr-only lg:not-sr-only">검색</span>
            </Button>
          ) : (
            <Button size="lg" className="w-full gap-2 rounded-xl md:w-auto" asChild>
              <Link href={href}>
                <Search className="size-5" />
                <span className="md:sr-only lg:not-sr-only">검색</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface SearchFieldProps {
  icon: React.ElementType
  label: string
  value?: string
  placeholder: string
  className?: string
}

function SearchField({ icon: Icon, label, value, placeholder, className }: SearchFieldProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 text-left",
        "rounded-xl p-2 transition-colors hover:bg-muted/50",
        "md:rounded-none md:hover:bg-transparent",
        className
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm text-foreground">{value || placeholder}</p>
      </div>
    </button>
  )
}

interface CompactSearchBarContentProps {
  location: string
  date: string
  guests: string
  href: string
  className?: string
}

function CompactSearchBarContent({
  location,
  date,
  guests,
  href,
  className,
}: CompactSearchBarContentProps) {
  return (
    <Link
      href={href}
      data-slot="search-bar"
      className={cn(
        "w-full flex items-center gap-2 px-2 py-2",
        "bg-muted hover:bg-muted/80 rounded-full",
        "border border-border shadow-sm",
        "transition-all hover:shadow-md",
        className
      )}
    >
      {/* Location */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-foreground font-medium">{location}</span>
      </div>

      <span className="text-border/60">|</span>

      {/* Date */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <CalendarDays className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">{date}</span>
      </div>

      <span className="text-border/60">|</span>

      {/* Guests */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <Users className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">{guests}</span>
      </div>

      {/* Search Button */}
      <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
        <Search className="size-4" />
      </div>
    </Link>
  )
}
