"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { X, Minus, Plus, ChevronLeft, ChevronRight, MapPin, Navigation, Train, Search, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"
import { useRegions } from "@/domains/search/hooks/useContentsData"
import { cityRegions } from "@/domains/search/data/regions"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function formatDateKr(d: Date) {
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${DAYS[d.getDay()]})`
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

// ─── SearchModal ───────────────────────────────────────────

export function SearchModal() {
  const { isOpen, step, close } = useSearchModal()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isOpen, close])

  if (!isOpen || !step) return null

  return (
    <>
      {/* 모바일: 풀스크린 통합 검색 모달 */}
      <div className="md:hidden fixed inset-0 z-[var(--z-modal)] animate-fade-in">
        <MobileSearchPanel />
      </div>

      {/* 데스크톱: 기존 개별 패널 */}
      <div className="hidden md:flex fixed inset-0 z-[var(--z-modal)] items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={close}
        />
        <div className="relative w-auto animate-fade-in-up">
          {step === "region" && <RegionPanel />}
          {step === "date" && <DatePanel />}
          {step === "guest" && <GuestPanel />}
        </div>
      </div>
    </>
  )
}

// ─── 지역 선택 패널 ─────────────────────────────────────────

function RegionPanel() {
  const { selectedCity, setCity, setArea, setRegionCode, setStep, close } = useSearchModal()
  const { data: apiRegions, isLoading } = useRegions()
  const [tab, setTab] = useState<"region" | "subway">("region")

  // 지역 목록
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

  // 지하철 목록 (3단계: 그룹 → 호선 → 역)
  const subwayGroups = useMemo(() => {
    if (!apiRegions?.subways?.length) return []
    return apiRegions.subways
      .filter((g) => g.open_yn !== "N")
      .map((group) => ({
        name: group.name,
        code: group.code,
        lines: (group.sub_regions || [])
          .filter((l) => l.open_yn !== "N")
          .map((line) => ({
            name: line.name,
            code: line.code,
            stations: (line.sub_regions || [])
              .filter((s) => s.open_yn !== "N")
              .map((s) => ({ name: s.name, code: s.code })),
          })),
      }))
  }, [apiRegions])

  const activeCity = selectedCity || regionList[0]?.name || ""
  const activeCityData = regionList.find((c) => c.name === activeCity)
  const [activeSubwayGroup, setActiveSubwayGroup] = useState(subwayGroups[0]?.name || "")
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const activeGroupData = subwayGroups.find((g) => g.name === activeSubwayGroup)
  const activeLineData = selectedLine
    ? activeGroupData?.lines.find((l) => l.name === selectedLine)
    : null

  useEffect(() => {
    if (tab === "subway" && subwayGroups.length && !activeSubwayGroup) {
      setActiveSubwayGroup(subwayGroups[0].name)
    }
  }, [tab, subwayGroups, activeSubwayGroup])

  const handleAreaClick = (area: { name: string; code: string }) => {
    setCity(activeCity)
    setArea(area.name)
    setRegionCode(area.code || activeCityData?.code || null)
    close()
  }

  const handleSubwaySelect = (station: { name: string; code: string }) => {
    setCity(null)
    setArea(station.name)
    setRegionCode(station.code)
    close()
  }

  const handleMyArea = () => {
    setCity(null)
    setArea(null)
    setRegionCode(null)
    close()
  }

  const hasSubways = subwayGroups.length > 0

  return (
    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[640px] h-[85vh] md:h-auto md:max-h-[80vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
        <h2 className="text-lg font-bold">지역 선택</h2>
        <button
          onClick={close}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="size-5 text-gray-500" />
        </button>
      </div>

      {/* 내 주변 + 탭 전환 */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border/50 shrink-0">
        <button
          onClick={handleMyArea}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-primary font-medium hover:bg-primary/5 rounded-full border border-primary/30"
        >
          <Navigation className="size-3.5" />
          내 주변
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setTab("region")}
            className={cn(
              "flex items-center gap-1 px-3.5 py-2 text-xs rounded-full transition-colors",
              tab === "region"
                ? "bg-primary text-white font-semibold"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <MapPin className="size-3.5" />
            지역
          </button>
          {hasSubways && (
            <button
              onClick={() => setTab("subway")}
              className={cn(
                "flex items-center gap-1 px-3.5 py-2 text-xs rounded-full transition-colors",
                tab === "subway"
                  ? "bg-primary text-white font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Train className="size-3.5" />
              지하철
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tab === "region" ? (
        <div className="flex flex-1 min-h-0 md:min-h-[400px]">
          {/* Left: City list */}
          <div className="w-[140px] border-r bg-gray-50/50 py-2 overflow-y-auto">
            {regionList.map((region) => (
              <button
                key={region.name}
                onClick={() => setCity(region.name)}
                className={cn(
                  "w-full text-left px-5 py-3.5 text-sm transition-colors relative",
                  activeCity === region.name
                    ? "text-primary font-semibold bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {activeCity === region.name && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                {region.name}
              </button>
            ))}
          </div>

          {/* Right: Area list — 하위 지역만 표시 (상위 코드 ALL_XX는 API 미지원) */}
          <div className="flex-1 py-2 overflow-y-auto">
            {activeCityData?.subRegions.map((area) => (
              <button
                key={area.code || area.name}
                onClick={() => handleAreaClick(area)}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MapPin className="size-4 text-gray-400" />
                <span>{area.name}</span>
                <ChevronRight className="size-4 text-gray-300 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 md:min-h-[400px]">
          {/* Left: Subway groups */}
          <div className="w-[140px] border-r bg-gray-50/50 py-2 overflow-y-auto">
            {subwayGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => {
                  setActiveSubwayGroup(group.name)
                  setSelectedLine(null)
                }}
                className={cn(
                  "w-full text-left px-5 py-3.5 text-sm transition-colors relative",
                  activeSubwayGroup === group.name
                    ? "text-primary font-semibold bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {activeSubwayGroup === group.name && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                {group.name}
              </button>
            ))}
          </div>

          {/* Right: Lines → Stations drill-down */}
          <div className="flex-1 overflow-y-auto">
            {selectedLine && activeLineData ? (
              <>
                <button
                  onClick={() => setSelectedLine(null)}
                  className="sticky top-0 z-10 w-full flex items-center gap-2 px-6 py-3 text-sm text-primary font-medium hover:bg-gray-50 transition-colors border-b border-border/50 bg-white"
                >
                  <ChevronLeft className="size-4" />
                  <span>{selectedLine}</span>
                </button>
                {activeLineData.stations.map((station) => (
                  <button
                    key={station.code || station.name}
                    onClick={() => handleSubwaySelect(station)}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Train className="size-4 text-gray-400" />
                    <span>{station.name}</span>
                    <ChevronRight className="size-4 text-gray-300 ml-auto" />
                  </button>
                ))}
                {!activeLineData.stations.length && (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    역 정보가 없습니다
                  </div>
                )}
              </>
            ) : (
              <>
                {activeGroupData?.lines.map((line) => (
                  <button
                    key={line.code || line.name}
                    onClick={() => setSelectedLine(line.name)}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Train className="size-4 text-gray-400" />
                    <span>{line.name}</span>
                    <ChevronRight className="size-4 text-gray-300 ml-auto" />
                  </button>
                ))}
                {!activeGroupData?.lines.length && (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    노선 정보가 없습니다
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 날짜 선택 패널 ─────────────────────────────────────────

function DatePanel() {
  const { checkIn, checkOut, setCheckIn, setCheckOut, setStep, close } =
    useSearchModal()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // 기본 체크인/아웃
  const effectiveCheckIn = checkIn || today
  const effectiveCheckOut = useMemo(() => {
    if (checkOut) return checkOut
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d
  }, [checkOut, today])

  const nights = diffDays(effectiveCheckIn, effectiveCheckOut)

  // 캘린더 네비게이션: baseMonth는 왼쪽 달
  const initialBase = useMemo(() => {
    const d = new Date(effectiveCheckIn)
    d.setDate(1)
    return d
  }, [effectiveCheckIn])

  const [baseMonth, setBaseMonth] = useReducedState(initialBase)

  const handlePrev = () => {
    const d = new Date(baseMonth)
    d.setMonth(d.getMonth() - 1)
    // 과거 달로 못 가게
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
    if (!checkIn || (checkIn && checkOut)) {
      // 새 선택 시작
      setCheckIn(date)
      setCheckOut(null)
    } else {
      // 체크아웃 선택
      if (date <= checkIn) {
        setCheckIn(date)
        setCheckOut(null)
      } else {
        setCheckOut(date)
      }
    }
  }

  const canApply = checkIn && checkOut

  const handleApply = () => {
    if (canApply) close()
  }

  const rightMonth = new Date(baseMonth)
  rightMonth.setMonth(rightMonth.getMonth() + 1)

  return (
    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[780px] h-[85vh] md:h-auto md:max-h-[80vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
        <h2 className="text-lg font-bold">날짜 선택</h2>
        <button
          onClick={close}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="size-5 text-gray-500" />
        </button>
      </div>

      {/* 체크인/아웃 요약 */}
      <div className="flex items-center justify-center gap-6 py-5 border-b shrink-0">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">체크인</p>
          <p className="text-lg font-bold">{formatDateKr(effectiveCheckIn)}</p>
        </div>
        <div className="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {nights > 0 ? `${nights}박` : "-"}
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">체크아웃</p>
          <p className="text-lg font-bold">
            {checkOut ? formatDateKr(effectiveCheckOut) : "-"}
          </p>
        </div>
      </div>

      {/* 스크롤 영역: 캘린더 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* 캘린더 네비게이션 */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-5 pb-2">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="size-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <span>
              {baseMonth.getFullYear()}년 {baseMonth.getMonth() + 1}월
            </span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="hidden md:inline">
              {rightMonth.getFullYear()}년 {rightMonth.getMonth() + 1}월
            </span>
          </div>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="size-5 text-gray-500" />
          </button>
        </div>

        {/* 캘린더: 모바일 1열, PC 2열 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-4">
          <CalendarMonth
            year={baseMonth.getFullYear()}
            month={baseMonth.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            today={today}
            onDateClick={handleDateClick}
          />
          <CalendarMonth
            year={rightMonth.getFullYear()}
            month={rightMonth.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            today={today}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      {/* 적용 버튼 — 하단 고정 */}
      <div className="px-6 py-4 border-t shrink-0">
        <Button
          className="w-full py-6 rounded-xl text-base font-semibold"
          disabled={!canApply}
          onClick={handleApply}
        >
          적용하기
        </Button>
      </div>
    </div>
  )
}

function useReducedState(initial: Date): [Date, (d: Date) => void] {
  const [state, setState] = useState(initial)
  return [state, setState]
}

// 캘린더 한 달

interface CalendarMonthProps {
  year: number
  month: number
  checkIn: Date | null
  checkOut: Date | null
  today: Date
  onDateClick: (date: Date) => void
}

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  today,
  onDateClick,
}: CalendarMonthProps) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-2",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-10" />
          }

          const date = new Date(year, month, day)
          const isPast = date < today
          const isToday = isSameDay(date, today)
          const isCheckIn = checkIn ? isSameDay(date, checkIn) : false
          const isCheckOut = checkOut ? isSameDay(date, checkOut) : false
          const isSelected = isCheckIn || isCheckOut
          const isInRange =
            checkIn && checkOut ? isBetween(date, checkIn, checkOut) : false

          const dayOfWeek = date.getDay()
          const isSunday = dayOfWeek === 0
          const isSaturday = dayOfWeek === 6

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onDateClick(date)}
              className={cn(
                "h-10 text-sm relative flex flex-col items-center justify-center transition-colors",
                isPast && "text-gray-200 cursor-not-allowed",
                !isPast && !isSelected && !isInRange && "hover:bg-gray-100 rounded-full",
                !isPast &&
                  !isSelected &&
                  !isInRange &&
                  isSunday &&
                  "text-red-400",
                !isPast &&
                  !isSelected &&
                  !isInRange &&
                  isSaturday &&
                  "text-blue-400",
                isInRange && "bg-primary/10",
                isSelected && "z-10"
              )}
            >
              {isSelected && (
                <span className="absolute inset-1 bg-primary rounded-full" />
              )}
              {isToday && !isSelected && (
                <span className="absolute inset-1 border-2 border-primary rounded-full" />
              )}
              <span
                className={cn(
                  "relative z-10",
                  isSelected ? "text-white font-bold" : isToday && "text-primary font-bold"
                )}
              >
                {day}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 인원 선택 패널 ─────────────────────────────────────────

function GuestPanel() {
  const {
    adults,
    kids,
    setAdults,
    setKids,
    close,
  } = useSearchModal()

  const handleApply = () => {
    close()
  }

  return (
    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[420px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-lg font-bold">인원 선택</h2>
        <button
          onClick={close}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="size-5 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6">
        {/* 성인 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">성인</p>
            <p className="text-sm text-gray-400">만 13세 이상</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={adults <= 1}
              onClick={() => setAdults(adults - 1)}
              className={cn(
                "size-9 rounded-full border-2 flex items-center justify-center transition-colors",
                adults <= 1
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-lg font-bold">{adults}</span>
            <button
              disabled={adults >= 10}
              onClick={() => setAdults(adults + 1)}
              className={cn(
                "size-9 rounded-full border-2 flex items-center justify-center transition-colors",
                adults >= 10
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* 아동 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">아동</p>
            <p className="text-sm text-gray-400">만 12세 이하</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={kids <= 0}
              onClick={() => setKids(kids - 1)}
              className={cn(
                "size-9 rounded-full border-2 flex items-center justify-center transition-colors",
                kids <= 0
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-lg font-bold">{kids}</span>
            <button
              disabled={kids >= 5}
              onClick={() => setKids(kids + 1)}
              className={cn(
                "size-9 rounded-full border-2 flex items-center justify-center transition-colors",
                kids >= 5
                  ? "border-gray-200 text-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
              )}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="px-6 pb-6">
        <Button
          className="w-full py-6 rounded-xl text-base font-semibold"
          onClick={handleApply}
        >
          성인 {adults}, 아동 {kids} 적용하기
        </Button>
      </div>
    </div>
  )
}

// ─── 모바일 통합 검색 패널 ──────────────────────────────────

function formatDateParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

type MobileTab = "region" | "date" | "guest"

function MobileSearchPanel() {
  const {
    step, setStep, close,
    selectedCity, selectedArea, regionCode,
    setCity, setArea, setRegionCode,
    checkIn, checkOut, setCheckIn, setCheckOut,
    adults, kids, setAdults, setKids,
  } = useSearchModal()
  const router = useRouter()
  const { data: apiRegions, isLoading } = useRegions()

  const activeTab: MobileTab = (step as MobileTab) || "region"

  // ─── 지역 데이터 ───
  const regionList = useMemo(() => {
    if (!apiRegions?.regions?.length) {
      return cityRegions.map((c) => ({
        name: c.city, code: "",
        subRegions: c.areas.map((a) => ({ name: a.name, code: "" })),
      }))
    }
    return apiRegions.regions
      .filter((r) => r.open_yn !== "N" || r.sub_regions?.some((s) => s.open_yn === "Y"))
      .map((r) => ({
        name: r.name, code: r.code,
        subRegions: (r.sub_regions || []).filter((s) => s.open_yn === "Y").map((s) => ({ name: s.name, code: s.code })),
      }))
  }, [apiRegions])

  const subwayGroups = useMemo(() => {
    if (!apiRegions?.subways?.length) return []
    return apiRegions.subways
      .filter((g) => g.open_yn !== "N")
      .map((group) => ({
        name: group.name, code: group.code,
        lines: (group.sub_regions || []).filter((l) => l.open_yn !== "N").map((line) => ({
          name: line.name, code: line.code,
          stations: (line.sub_regions || []).filter((s) => s.open_yn !== "N").map((s) => ({ name: s.name, code: s.code })),
        })),
      }))
  }, [apiRegions])

  const [regionTab, setRegionTab] = useState<"region" | "subway">("region")
  const activeCity = selectedCity || regionList[0]?.name || ""
  const activeCityData = regionList.find((c) => c.name === activeCity)
  const [activeSubwayGroup, setActiveSubwayGroup] = useState(subwayGroups[0]?.name || "")
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const activeGroupData = subwayGroups.find((g) => g.name === activeSubwayGroup)
  const activeLineData = selectedLine ? activeGroupData?.lines.find((l) => l.name === selectedLine) : null
  const hasSubways = subwayGroups.length > 0

  useEffect(() => {
    if (regionTab === "subway" && subwayGroups.length && !activeSubwayGroup) {
      setActiveSubwayGroup(subwayGroups[0].name)
    }
  }, [regionTab, subwayGroups, activeSubwayGroup])

  // ─── 날짜 데이터 ───
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const effectiveCheckIn = checkIn || today
  const effectiveCheckOut = useMemo(() => {
    if (checkOut) return checkOut
    const d = new Date(today); d.setDate(d.getDate() + 1); return d
  }, [checkOut, today])
  const nights = diffDays(effectiveCheckIn, effectiveCheckOut)
  const [baseMonth, setBaseMonth] = useState(() => { const d = new Date(effectiveCheckIn); d.setDate(1); return d })

  // ─── 요약 라벨 ───
  const locationDisplay = selectedArea || selectedCity || "내 주변"
  const dateDisplay = checkIn
    ? `${formatDateKr(checkIn)} - ${checkOut ? formatDateKr(checkOut) : "?"} ${checkOut ? `${nights}박` : ""}`
    : "날짜 선택"
  const guestDisplay = kids > 0 ? `성인 ${adults}, 아동 ${kids}` : `성인 ${adults}명`

  // ─── 핸들러 ───
  const handleRegionSelect = (city: string | null, area: string | null, code: string | null) => {
    setCity(city)
    setArea(area)
    setRegionCode(code)
    setStep("date") // 지역 선택 후 날짜 탭으로 자동 이동
  }

  const handleDateClick = (date: Date) => {
    if (date < today) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut(null)
    } else {
      if (date <= checkIn) { setCheckIn(date); setCheckOut(null) }
      else { setCheckOut(date) }
    }
  }

  const handlePrev = () => {
    const d = new Date(baseMonth); d.setMonth(d.getMonth() - 1)
    const firstOfCurrent = new Date(today.getFullYear(), today.getMonth(), 1)
    if (d >= firstOfCurrent) setBaseMonth(d)
  }
  const handleNext = () => {
    const d = new Date(baseMonth); d.setMonth(d.getMonth() + 1); setBaseMonth(d)
  }

  const handleSearch = () => {
    close()
    const params = new URLSearchParams()
    const displayName = selectedArea || selectedCity || ""
    if (regionCode) {
      params.set("regionCode", regionCode)
      if (displayName) params.set("regionName", displayName)
    }
    const ci = checkIn || today
    const co = checkOut || (() => { const d = new Date(today); d.setDate(d.getDate() + 1); return d })()
    params.set("checkIn", formatDateParam(ci))
    params.set("checkOut", formatDateParam(co))
    params.set("adults", String(adults))
    if (kids > 0) params.set("kids", String(kids))
    router.push(`/search?${params.toString()}`)
  }

  const tabs: { key: MobileTab; icon: React.ElementType; label: string; value: string }[] = [
    { key: "region", icon: MapPin, label: "지역", value: locationDisplay },
    { key: "date", icon: CalendarDays, label: "날짜", value: dateDisplay },
    { key: "guest", icon: Users, label: "인원", value: guestDisplay },
  ]

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
        <h2 className="text-lg font-bold">검색</h2>
        <button onClick={close} className="p-1 rounded-full hover:bg-gray-100">
          <X className="size-5 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setStep(t.key)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors relative",
              activeTab === t.key
                ? "text-primary font-semibold"
                : "text-gray-400"
            )}
          >
            <t.icon className="size-4" />
            <span className="truncate max-w-[90%]">{t.value}</span>
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "region" && (
          <>
            {/* 내 주변 + 탭 전환 */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border/50">
              <button
                onClick={() => handleRegionSelect(null, null, null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium hover:bg-primary/5 rounded-full border border-primary/30"
              >
                <Navigation className="size-3" />
                내 주변
              </button>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => setRegionTab("region")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors",
                    regionTab === "region" ? "bg-primary text-white font-semibold" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <MapPin className="size-3" /> 지역
                </button>
                {hasSubways && (
                  <button
                    onClick={() => setRegionTab("subway")}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors",
                      regionTab === "subway" ? "bg-primary text-white font-semibold" : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    <Train className="size-3" /> 지하철
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : regionTab === "region" ? (
              <div className="flex min-h-[360px]">
                <div className="w-[120px] border-r bg-gray-50/50 py-1 overflow-y-auto">
                  {regionList.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => setCity(region.name)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm relative",
                        activeCity === region.name ? "text-primary font-semibold bg-white" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {activeCity === region.name && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />}
                      {region.name}
                    </button>
                  ))}
                </div>
                <div className="flex-1 py-1 overflow-y-auto">
                  {activeCityData?.subRegions.map((area) => (
                    <button
                      key={area.code || area.name}
                      onClick={() => handleRegionSelect(activeCity, area.name, area.code || activeCityData?.code || null)}
                      className="w-full flex items-center gap-2.5 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <MapPin className="size-3.5 text-gray-400" />
                      <span>{area.name}</span>
                      <ChevronRight className="size-3.5 text-gray-300 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px]">
                <div className="w-[120px] border-r bg-gray-50/50 py-1 overflow-y-auto">
                  {subwayGroups.map((group) => (
                    <button
                      key={group.name}
                      onClick={() => { setActiveSubwayGroup(group.name); setSelectedLine(null) }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm relative",
                        activeSubwayGroup === group.name ? "text-primary font-semibold bg-white" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {activeSubwayGroup === group.name && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />}
                      {group.name}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {selectedLine && activeLineData ? (
                    <>
                      <button
                        onClick={() => setSelectedLine(null)}
                        className="sticky top-0 z-10 w-full flex items-center gap-1.5 px-5 py-2.5 text-sm text-primary font-medium hover:bg-gray-50 border-b border-border/50 bg-white"
                      >
                        <ChevronLeft className="size-3.5" />
                        <span>{selectedLine}</span>
                      </button>
                      {activeLineData.stations.map((station) => (
                        <button
                          key={station.code || station.name}
                          onClick={() => handleRegionSelect(null, station.name, station.code)}
                          className="w-full flex items-center gap-2.5 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Train className="size-3.5 text-gray-400" />
                          <span>{station.name}</span>
                          <ChevronRight className="size-3.5 text-gray-300 ml-auto" />
                        </button>
                      ))}
                      {!activeLineData.stations.length && (
                        <div className="flex items-center justify-center py-10 text-sm text-gray-400">역 정보가 없습니다</div>
                      )}
                    </>
                  ) : (
                    <>
                      {activeGroupData?.lines.map((line) => (
                        <button
                          key={line.code || line.name}
                          onClick={() => setSelectedLine(line.name)}
                          className="w-full flex items-center gap-2.5 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Train className="size-3.5 text-gray-400" />
                          <span>{line.name}</span>
                          <ChevronRight className="size-3.5 text-gray-300 ml-auto" />
                        </button>
                      ))}
                      {!activeGroupData?.lines.length && (
                        <div className="flex items-center justify-center py-10 text-sm text-gray-400">노선 정보가 없습니다</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "date" && (
          <div className="px-5">
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
                <p className="text-base font-bold">{checkOut ? formatDateKr(effectiveCheckOut) : "-"}</p>
              </div>
            </div>

            {/* 캘린더 네비게이션 */}
            <div className="flex items-center justify-between pt-4 pb-1">
              <button onClick={handlePrev} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="size-5 text-gray-500" />
              </button>
              <span className="text-sm font-semibold">
                {baseMonth.getFullYear()}년 {baseMonth.getMonth() + 1}월
              </span>
              <button onClick={handleNext} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight className="size-5 text-gray-500" />
              </button>
            </div>

            <CalendarMonth
              year={baseMonth.getFullYear()}
              month={baseMonth.getMonth()}
              checkIn={checkIn}
              checkOut={checkOut}
              today={today}
              onDateClick={handleDateClick}
            />
          </div>
        )}

        {activeTab === "guest" && (
          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold">성인</p>
                <p className="text-sm text-gray-400">만 13세 이상</p>
              </div>
              <div className="flex items-center gap-4">
                <button disabled={adults <= 1} onClick={() => setAdults(adults - 1)}
                  className={cn("size-9 rounded-full border-2 flex items-center justify-center", adults <= 1 ? "border-gray-200 text-gray-200 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary")}>
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold">{adults}</span>
                <button disabled={adults >= 10} onClick={() => setAdults(adults + 1)}
                  className={cn("size-9 rounded-full border-2 flex items-center justify-center", adults >= 10 ? "border-gray-200 text-gray-200 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary")}>
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold">아동</p>
                <p className="text-sm text-gray-400">만 12세 이하</p>
              </div>
              <div className="flex items-center gap-4">
                <button disabled={kids <= 0} onClick={() => setKids(kids - 1)}
                  className={cn("size-9 rounded-full border-2 flex items-center justify-center", kids <= 0 ? "border-gray-200 text-gray-200 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary")}>
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold">{kids}</span>
                <button disabled={kids >= 5} onClick={() => setKids(kids + 1)}
                  className={cn("size-9 rounded-full border-2 flex items-center justify-center", kids >= 5 ? "border-gray-200 text-gray-200 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary")}>
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 검색 바 */}
      <div className="border-t px-5 py-4 shrink-0 space-y-3">
        <Button className="w-full py-6 rounded-xl text-base font-semibold gap-2" onClick={handleSearch}>
          <Search className="size-5" />
          검색하기
        </Button>
      </div>
    </div>
  )
}
