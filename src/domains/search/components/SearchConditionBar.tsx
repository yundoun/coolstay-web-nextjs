"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Users,
  MapPin,
  Search,
  Minus,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"
import { useRegions } from "../hooks/useContentsData"
import { cityRegions } from "../data/regions"

type DropdownType = "region" | "date" | "guest" | null

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(d: Date) {
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
}

function formatDateParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBetween(d: Date, start: Date, end: Date) {
  return d.getTime() > start.getTime() && d.getTime() < end.getTime()
}

interface SearchConditionBarProps {
  selectedRegion: string | null
  onRegionChange: (region: string, code: string) => void
  checkIn: string
  checkOut: string
  adults: number
  kids: number
  onDateChange: (checkIn: string, checkOut: string) => void
  onGuestChange: (adults: number, kids: number) => void
  onSearch?: () => void
}

export function SearchConditionBar({
  selectedRegion,
  onRegionChange,
  checkIn,
  checkOut,
  adults,
  kids,
  onDateChange,
  onGuestChange,
  onSearch,
}: SearchConditionBarProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 라벨
  const regionLabel = selectedRegion || "전체"

  // 모바일 축약 날짜: 3/25~3/26 1박
  const ciDate = new Date(checkIn + "T00:00:00")
  const coDate = new Date(checkOut + "T00:00:00")
  const nights = diffDays(ciDate, coDate)
  const dateLabelShort = `${ciDate.getMonth() + 1}/${ciDate.getDate()}~${coDate.getMonth() + 1}/${coDate.getDate()} ${nights}박`
  const dateLabelFull = `${checkIn} ~ ${checkOut}`

  const totalGuests = adults + kids
  const guestLabelShort = `${totalGuests}명`
  const guestLabelFull = kids > 0 ? `성인 ${adults} 아동 ${kids}` : `성인 ${adults}`

  const openModal = useSearchModal((s) => s.open)

  return (
    <div ref={containerRef} className="sticky top-16 md:top-[var(--header-height)] z-40 -mx-4 px-4 md:-mx-6 md:px-6 py-2.5 bg-background/95 backdrop-blur-md border-b border-border/50">
      {/* 모바일: 요약 바 → 탭하면 SearchModal 열기 */}
      <button
        className="md:hidden flex items-center gap-2 w-full px-3 py-2 rounded-full border border-border/60 bg-muted/40 text-xs text-foreground"
        onClick={() => openModal("region")}
      >
        <Search className="size-3.5 text-muted-foreground shrink-0" />
        <span className="flex items-center gap-1.5 truncate">
          <span className="font-medium">{regionLabel}</span>
          <span className="text-muted-foreground">·</span>
          <span>{dateLabelShort}</span>
          <span className="text-muted-foreground">·</span>
          <span>{guestLabelShort}</span>
        </span>
        <ChevronRight className="size-3.5 text-muted-foreground shrink-0 ml-auto" />
      </button>

      {/* PC: 기존 드롭다운 필터 */}
      <div className="hidden md:flex items-center gap-2">
        {/* Region */}
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

        {/* Date */}
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

        {/* Guest */}
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

        {/* Search */}
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
          kids={kids}
          onGuestChange={(a, k) => {
            onGuestChange(a, k)
            setOpenDropdown(null)
          }}
          onClose={() => setOpenDropdown(null)}
        />
      )}
    </div>
  )
}

// ─── 지역 드롭다운 ───────────────────────────────────────────

function RegionDropdown({
  onSelect,
  onClose,
}: {
  onSelect: (keyword: string, code: string) => void
  onClose: () => void
}) {
  const { data: apiRegions, isLoading } = useRegions("MOTEL")

  // API 데이터 → 도시/지역 목록 변환 (API 실패 시 mock 폴백)
  const regionList = useMemo(() => {
    if (!apiRegions?.regions?.length) {
      return cityRegions.map((c) => ({
        name: c.city,
        code: "",
        subRegions: c.areas.map((a) => ({ name: a.name, code: "" })),
      }))
    }
    return apiRegions.regions
      .filter((r) => r.open_yn !== "N" || r.sub_regions?.some((s) => s.open_yn === "Y"))
      .map((r) => ({
        name: r.name,
        code: r.code,
        subRegions: (r.sub_regions || [])
          .filter((s) => s.open_yn === "Y")
          .map((s) => ({ name: s.name, code: s.code })),
      }))
  }, [apiRegions])

  const [activeCity, setActiveCity] = useState(regionList[0]?.name || "")
  const activeCityData = regionList.find((c) => c.name === activeCity)

  const handleSelect = (name: string, code: string) => {
    onSelect(name, code)
  }

  return (
    <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border w-[580px] max-h-[480px] overflow-hidden animate-fade-in-down">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <h3 className="text-sm font-bold">지역 선택</h3>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-gray-100">
          <X className="size-4 text-gray-400" />
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[380px]">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="flex h-[380px]">
          {/* Cities */}
          <div className="w-[120px] border-r bg-gray-50/50 py-1 overflow-y-auto">
            {regionList.map((region) => (
              <button
                key={region.name}
                onClick={() => setActiveCity(region.name)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm relative",
                  activeCity === region.name
                    ? "text-primary font-semibold bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {activeCity === region.name && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                )}
                {region.name}
              </button>
            ))}
          </div>
          {/* Areas */}
          <div className="flex-1 py-1 overflow-y-auto">
            <button
              onClick={() => handleSelect(activeCity, activeCityData?.code || "")}
              className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="size-3.5 text-gray-400" />
              <span className="font-medium">{activeCity} 전체</span>
              <ChevronRight className="size-3.5 text-gray-300 ml-auto" />
            </button>
            {activeCityData?.subRegions.map((area) => (
              <button
                key={area.code || area.name}
                onClick={() => handleSelect(area.name, area.code)}
                className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <MapPin className="size-3.5 text-gray-400" />
                <span>{area.name}</span>
                <ChevronRight className="size-3.5 text-gray-300 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 날짜 드롭다운 ───────────────────────────────────────────

function DateDropdown({
  checkIn: checkInStr,
  checkOut: checkOutStr,
  onDateChange,
  onClose,
}: {
  checkIn: string
  checkOut: string
  onDateChange: (checkIn: string, checkOut: string) => void
  onClose: () => void
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(
    checkInStr ? new Date(checkInStr + "T00:00:00") : null
  )
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(
    checkOutStr ? new Date(checkOutStr + "T00:00:00") : null
  )

  const effectiveCheckIn = selectedCheckIn || today
  const effectiveCheckOut = useMemo(() => {
    if (selectedCheckOut) return selectedCheckOut
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d
  }, [selectedCheckOut, today])

  const nights = selectedCheckIn && selectedCheckOut
    ? diffDays(selectedCheckIn, selectedCheckOut)
    : 0

  const initialBase = useMemo(() => {
    const d = new Date(effectiveCheckIn)
    d.setDate(1)
    return d
  }, [effectiveCheckIn])

  const [baseMonth, setBaseMonth] = useState(initialBase)

  const handlePrev = () => {
    const d = new Date(baseMonth)
    d.setMonth(d.getMonth() - 1)
    const firstOfCurrent = new Date(today.getFullYear(), today.getMonth(), 1)
    if (d >= firstOfCurrent) setBaseMonth(d)
  }

  const handleNext = () => {
    const d = new Date(baseMonth)
    d.setMonth(d.getMonth() + 1)
    setBaseMonth(d)
  }

  const handleDateClick = (date: Date) => {
    if (date < today) return
    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date)
      setSelectedCheckOut(null)
    } else {
      if (date <= selectedCheckIn) {
        setSelectedCheckIn(date)
        setSelectedCheckOut(null)
      } else {
        setSelectedCheckOut(date)
      }
    }
  }

  const canApply = selectedCheckIn && selectedCheckOut

  const handleApply = () => {
    if (canApply) {
      onDateChange(formatDateParam(selectedCheckIn), formatDateParam(selectedCheckOut))
    }
  }

  const rightMonth = new Date(baseMonth)
  rightMonth.setMonth(rightMonth.getMonth() + 1)

  return (
    <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border w-[700px] overflow-hidden animate-fade-in-down">
      {/* 체크인/아웃 요약 */}
      <div className="flex items-center justify-center gap-5 py-4 border-b">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-0.5">체크인</p>
          <p className="text-base font-bold">{formatDateKr(effectiveCheckIn)}</p>
        </div>
        <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {nights > 0 ? `${nights}박` : "-"}
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-0.5">체크아웃</p>
          <p className="text-base font-bold">
            {selectedCheckOut ? formatDateKr(effectiveCheckOut) : "-"}
          </p>
        </div>
        <button onClick={onClose} className="absolute right-4 p-0.5 rounded-full hover:bg-gray-100">
          <X className="size-4 text-gray-400" />
        </button>
      </div>

      {/* 캘린더 네비게이션 */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1">
        <button onClick={handlePrev} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="size-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <span>{baseMonth.getFullYear()}년 {baseMonth.getMonth() + 1}월</span>
          <span className="text-gray-300">|</span>
          <span>{rightMonth.getFullYear()}년 {rightMonth.getMonth() + 1}월</span>
        </div>
        <button onClick={handleNext} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="size-4 text-gray-500" />
        </button>
      </div>

      {/* 듀얼 캘린더 */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-3">
        <CalendarMonth
          year={baseMonth.getFullYear()}
          month={baseMonth.getMonth()}
          checkIn={selectedCheckIn}
          checkOut={selectedCheckOut}
          today={today}
          onDateClick={handleDateClick}
        />
        <CalendarMonth
          year={rightMonth.getFullYear()}
          month={rightMonth.getMonth()}
          checkIn={selectedCheckIn}
          checkOut={selectedCheckOut}
          today={today}
          onDateClick={handleDateClick}
        />
      </div>

      {/* 적용 */}
      <div className="px-5 pb-4">
        <Button
          className="w-full py-5 rounded-lg text-sm font-semibold"
          disabled={!canApply}
          onClick={handleApply}
        >
          적용하기
        </Button>
      </div>
    </div>
  )
}

// ─── 캘린더 한 달 ────────────────────────────────────────────

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  today,
  onDateClick,
}: {
  year: number
  month: number
  checkIn: Date | null
  checkOut: Date | null
  today: Date
  onDateClick: (date: Date) => void
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="grid grid-cols-7 mb-0.5">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-1.5",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="h-9" />
          const date = new Date(year, month, day)
          const isPast = date < today
          const isCheckIn = checkIn ? isSameDay(date, checkIn) : false
          const isCheckOut = checkOut ? isSameDay(date, checkOut) : false
          const isSelected = isCheckIn || isCheckOut
          const isInRange = checkIn && checkOut ? isBetween(date, checkIn, checkOut) : false
          const dow = date.getDay()

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onDateClick(date)}
              className={cn(
                "h-9 text-sm relative flex items-center justify-center",
                isPast && "text-gray-200 cursor-not-allowed",
                !isPast && !isSelected && !isInRange && "hover:bg-gray-100 rounded-full",
                !isPast && !isSelected && !isInRange && dow === 0 && "text-red-400",
                !isPast && !isSelected && !isInRange && dow === 6 && "text-blue-400",
                isInRange && "bg-primary/10",
                isSelected && "z-10"
              )}
            >
              {isSelected && <span className="absolute inset-1 bg-primary rounded-full" />}
              <span className={cn("relative z-10", isSelected && "text-white font-bold")}>{day}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 인원 드롭다운 ───────────────────────────────────────────

function GuestDropdown({
  adults,
  kids,
  onGuestChange,
  onClose,
}: {
  adults: number
  kids: number
  onGuestChange: (adults: number, kids: number) => void
  onClose: () => void
}) {
  const [localAdults, setLocalAdults] = useState(adults)
  const [localKids, setLocalKids] = useState(kids)

  return (
    <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border w-[360px] overflow-hidden animate-fade-in-down">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <h3 className="text-sm font-bold">인원 선택</h3>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-gray-100">
          <X className="size-4 text-gray-400" />
        </button>
      </div>
      <div className="px-5 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">성인</p>
            <p className="text-xs text-gray-400">만 13세 이상</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={localAdults <= 1}
              onClick={() => setLocalAdults(localAdults - 1)}
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center",
                localAdults <= 1
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center text-base font-bold">{localAdults}</span>
            <button
              disabled={localAdults >= 10}
              onClick={() => setLocalAdults(localAdults + 1)}
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center",
                localAdults >= 10
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">아동</p>
            <p className="text-xs text-gray-400">만 12세 이하</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={localKids <= 0}
              onClick={() => setLocalKids(localKids - 1)}
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center",
                localKids <= 0
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center text-base font-bold">{localKids}</span>
            <button
              disabled={localKids >= 5}
              onClick={() => setLocalKids(localKids + 1)}
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center",
                localKids >= 5
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <Button
          className="w-full py-5 rounded-lg text-sm font-semibold"
          onClick={() => onGuestChange(localAdults, localKids)}
        >
          성인 {localAdults}, 아동 {localKids} 적용하기
        </Button>
      </div>
    </div>
  )
}
