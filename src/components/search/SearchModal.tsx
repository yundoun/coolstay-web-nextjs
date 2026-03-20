"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Search,
  MapPin,
  CalendarDays,
  Users,
  Minus,
  Plus,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"
import { regionOptions } from "@/domains/search/data/filterOptions"

const popularKeywords = [
  "해운대", "제주 오션뷰", "강남 호텔", "속초 펜션", "경주 한옥",
]

export function SearchModal() {
  const { isOpen, close } = useSearchModal()
  const router = useRouter()

  const [step, setStep] = useState<"region" | "date" | "guests">("region")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)

  // ESC 닫기
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

  // 모달 열릴 때 step 리셋
  useEffect(() => {
    if (isOpen) setStep("region")
  }, [isOpen])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedRegion) params.set("region", selectedRegion)
    close()
    router.push(`/search?${params.toString()}`)
  }, [selectedRegion, close, router])

  const handleKeywordClick = useCallback(
    (keyword: string) => {
      close()
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
    },
    [close, router]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-2xl mx-4 mt-16 md:mt-24",
          "bg-card rounded-xl border shadow-xl",
          "animate-fade-in-up",
          "max-h-[80vh] overflow-hidden flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="font-semibold">숙소 검색</h2>
          <Button variant="ghost" size="icon" onClick={close} className="size-8 rounded-full">
            <X className="size-4" />
          </Button>
        </div>

        {/* Step Tabs */}
        <div className="flex border-b shrink-0">
          <StepTab
            label="여행지"
            icon={MapPin}
            value={selectedRegion ? regionOptions.find((r) => r.value === selectedRegion)?.label : undefined}
            isActive={step === "region"}
            onClick={() => setStep("region")}
          />
          <StepTab
            label="날짜"
            icon={CalendarDays}
            value={checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : undefined}
            isActive={step === "date"}
            onClick={() => setStep("date")}
          />
          <StepTab
            label="인원"
            icon={Users}
            value={kids > 0 ? `성인 ${adults}, 아동 ${kids}` : `성인 ${adults}`}
            isActive={step === "guests"}
            onClick={() => setStep("guests")}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {step === "region" && (
            <RegionStep
              selected={selectedRegion}
              onSelect={(region) => {
                setSelectedRegion(region)
                setStep("date")
              }}
              onKeywordClick={handleKeywordClick}
            />
          )}
          {step === "date" && (
            <DateStep
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onNext={() => setStep("guests")}
            />
          )}
          {step === "guests" && (
            <GuestStep
              adults={adults}
              kids={kids}
              onAdultsChange={setAdults}
              onKidsChange={setKids}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-card shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRegion(null)
              setCheckIn("")
              setCheckOut("")
              setAdults(2)
              setKids(0)
              setStep("region")
            }}
          >
            초기화
          </Button>
          <Button onClick={handleSearch} className="gap-2 rounded-xl px-6">
            <Search className="size-4" />
            검색하기
          </Button>
        </div>
      </div>
    </div>
  )
}

function StepTab({
  label,
  icon: Icon,
  value,
  isActive,
  onClick,
}: {
  label: string
  icon: React.ElementType
  value?: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center gap-2 px-4 py-3 text-sm transition-colors relative",
        isActive
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <div className="min-w-0 text-left">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">
          {value || "선택하세요"}
        </p>
      </div>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
      )}
    </button>
  )
}

function RegionStep({
  selected,
  onSelect,
  onKeywordClick,
}: {
  selected: string | null
  onSelect: (region: string) => void
  onKeywordClick: (keyword: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Region Grid */}
      <div>
        <p className="text-sm font-medium mb-3">지역 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {regionOptions.map((region) => (
            <button
              key={region.value}
              onClick={() => onSelect(region.value)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                selected === region.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card hover:bg-muted border-border"
              )}
            >
              <span className="text-sm font-medium">{region.label}</span>
              <span
                className={cn(
                  "text-xs",
                  selected === region.value
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {region.accommodationCount?.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Keywords */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-primary" />
          <p className="text-sm font-medium">인기 검색어</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onKeywordClick(keyword)}
              className="px-3 py-1.5 rounded-full border text-sm hover:bg-muted transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DateStep({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onNext,
}: {
  checkIn: string
  checkOut: string
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
  onNext: () => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium mb-3">날짜 선택</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">체크인</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full px-4 py-3 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">체크아웃</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full px-4 py-3 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        최대 9박까지 예약할 수 있습니다
      </p>
      <Button variant="outline" className="w-full rounded-xl" onClick={onNext}>
        다음: 인원 선택
      </Button>
    </div>
  )
}

function GuestStep({
  adults,
  kids,
  onAdultsChange,
  onKidsChange,
}: {
  adults: number
  kids: number
  onAdultsChange: (n: number) => void
  onKidsChange: (n: number) => void
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm font-medium mb-3">인원 선택</p>
      <GuestCounter
        label="성인"
        description="만 14세 이상"
        count={adults}
        min={1}
        max={10}
        onChange={onAdultsChange}
      />
      <div className="border-t" />
      <GuestCounter
        label="아동"
        description="만 14세 미만"
        count={kids}
        min={0}
        max={5}
        onChange={onKidsChange}
      />
    </div>
  )
}

function GuestCounter({
  label,
  description,
  count,
  min,
  max,
  onChange,
}: {
  label: string
  description: string
  count: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-full"
          disabled={count <= min}
          onClick={() => onChange(count - 1)}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-6 text-center font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-full"
          disabled={count >= max}
          onClick={() => onChange(count + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}
