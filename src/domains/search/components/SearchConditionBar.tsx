"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { CalendarDays, Users, MapPin, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"
import { diffDays } from "./condition-bar/date-utils"
import { RegionDropdown } from "./condition-bar/RegionDropdown"
import { DateDropdown } from "./condition-bar/DateDropdown"
import { GuestDropdown } from "./condition-bar/GuestDropdown"

type DropdownType = "region" | "date" | "guest" | null

interface SearchConditionBarProps {
  selectedRegion: string | null
  isKeywordSearch?: boolean
  onRegionChange: (region: string, code: string) => void
  checkIn: string
  checkOut: string
  adults: number
  businessType?: string
  onDateChange: (checkIn: string, checkOut: string) => void
  onGuestChange: (adults: number) => void
  onSearch?: () => void
}

export function SearchConditionBar({
  selectedRegion,
  isKeywordSearch,
  onRegionChange,
  checkIn,
  checkOut,
  adults,
  businessType,
  onDateChange,
  onGuestChange,
  onSearch,
}: SearchConditionBarProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  // 헤더 확장 슬롯에 portal 연결
  useEffect(() => {
    setPortalTarget(document.getElementById("header-extension"))
  }, [])

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!openDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [openDropdown])

  const toggle = (type: DropdownType) => {
    setOpenDropdown((prev) => (prev === type ? null : type))
  }

  const regionLabel = selectedRegion || "내 주변"

  const ciDate = new Date(checkIn + "T00:00:00")
  const coDate = new Date(checkOut + "T00:00:00")
  const nights = diffDays(ciDate, coDate)
  const dateLabelShort = `${ciDate.getMonth() + 1}/${ciDate.getDate()}~${coDate.getMonth() + 1}/${coDate.getDate()} ${nights}박`
  const dateLabelFull = `${checkIn} ~ ${checkOut}`

  const guestLabelShort = `${adults}명`
  const guestLabelFull = `성인 ${adults}`

  const openModal = useSearchModal((s) => s.open)
  const openWithBusinessType = useSearchModal((s) => s.openWithBusinessType)

  const handleMobileBarClick = () => {
    if (businessType) {
      openWithBusinessType(businessType)
    } else {
      openModal("region")
    }
  }

  const barContent = (
    <div ref={containerRef} className="bg-white">
    <Container size="narrow" className="relative py-2.5">
      {/* 모바일: 요약 바 → 탭하면 SearchModal 열기 */}
      <button
        className="md:hidden flex items-center gap-2 w-full px-3 py-2 rounded-full border border-border/60 bg-muted/40 text-xs text-foreground"
        onClick={handleMobileBarClick}
      >
        <Search className="size-3.5 text-muted-foreground shrink-0" />
        <span className="flex items-center gap-1.5 truncate">
          {!isKeywordSearch && (
            <>
              <span className="font-medium">{regionLabel}</span>
              <span className="text-muted-foreground">·</span>
            </>
          )}
          <span>{dateLabelShort}</span>
          <span className="text-muted-foreground">·</span>
          <span>{guestLabelShort}</span>
        </span>
        <ChevronRight className="size-3.5 text-muted-foreground shrink-0 ml-auto" />
      </button>

      {/* PC: 드롭다운 필터 */}
      <div className="hidden md:flex items-center gap-2">
        {!isKeywordSearch && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 rounded-full",
              openDropdown === "region" && "border-primary text-primary"
            )}
            onClick={() => toggle("region")}
          >
            <MapPin className="size-3.5" />
            {regionLabel}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full",
            openDropdown === "date" && "border-primary text-primary"
          )}
          onClick={() => toggle("date")}
        >
          <CalendarDays className="size-3.5" />
          {dateLabelFull}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full",
            openDropdown === "guest" && "border-primary text-primary"
          )}
          onClick={() => toggle("guest")}
        >
          <Users className="size-3.5" />
          {guestLabelFull}
        </Button>

        {onSearch && (
          <Button
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={onSearch}
          >
            <Search className="size-3.5" />
            검색
          </Button>
        )}
      </div>

      {/* Dropdown Panels */}
      {openDropdown === "region" && (
        <RegionDropdown
          businessType={businessType}
          onSelect={(keyword, code) => {
            onRegionChange(keyword, code)
            setOpenDropdown(null)
          }}
          onClose={() => setOpenDropdown(null)}
        />
      )}
      {openDropdown === "date" && (
        <DateDropdown
          checkIn={checkIn}
          checkOut={checkOut}
          onDateChange={(ci, co) => {
            onDateChange(ci, co)
            setOpenDropdown(null)
          }}
          onClose={() => setOpenDropdown(null)}
        />
      )}
      {openDropdown === "guest" && (
        <GuestDropdown
          adults={adults}
          onGuestChange={(a) => {
            onGuestChange(a)
            setOpenDropdown(null)
          }}
          onClose={() => setOpenDropdown(null)}
        />
      )}
    </Container>
    </div>
  )

  if (!portalTarget) return null
  return createPortal(barContent, portalTarget)
}
