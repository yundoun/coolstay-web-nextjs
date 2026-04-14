"use client"

import { useState, useMemo, useEffect } from "react"
import { X, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── 공통 유틸 ─────────────────────────────────────────────

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

// ─── 날짜 선택 모달 ──────────────────────────────────────────

interface DatePickerModalProps {
  checkIn: Date
  checkOut: Date
  onApply: (checkIn: Date, checkOut: Date) => void
  onClose: () => void
}

export function DatePickerModal({ checkIn, checkOut, onApply, onClose }: DatePickerModalProps) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkIn)
  const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOut)

  const effectiveCheckIn = tempCheckIn || today
  const effectiveCheckOut = useMemo(() => {
    if (tempCheckOut) return tempCheckOut
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d
  }, [tempCheckOut, today])

  const nights = diffDays(effectiveCheckIn, effectiveCheckOut)

  const [baseMonth, setBaseMonth] = useState(() => {
    const d = new Date(effectiveCheckIn)
    d.setDate(1)
    return d
  })

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
    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      setTempCheckIn(date)
      setTempCheckOut(null)
    } else {
      if (date <= tempCheckIn) {
        setTempCheckIn(date)
        setTempCheckOut(null)
      } else {
        setTempCheckOut(date)
      }
    }
  }

  const canApply = tempCheckIn && tempCheckOut

  const handleApply = () => {
    if (tempCheckIn && tempCheckOut) {
      onApply(tempCheckIn, tempCheckOut)
      onClose()
    }
  }

  const rightMonth = new Date(baseMonth)
  rightMonth.setMonth(rightMonth.getMonth() + 1)

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-background rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[780px] h-[85vh] md:h-auto md:max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
          <h2 className="text-lg font-bold">날짜 선택</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 py-5 border-b shrink-0">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">체크인</p>
            <p className="text-lg font-bold">{formatDateKr(effectiveCheckIn)}</p>
          </div>
          <div className="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {nights > 0 ? `${nights}박` : "-"}
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">체크아웃</p>
            <p className="text-lg font-bold">
              {tempCheckOut ? formatDateKr(effectiveCheckOut) : "-"}
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between px-6 md:px-8 pt-5 pb-2">
            <button onClick={handlePrev} className="p-1 rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="size-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-6 text-sm font-semibold">
              <span>{baseMonth.getFullYear()}년 {baseMonth.getMonth() + 1}월</span>
              <span className="hidden md:inline text-muted-foreground/40">|</span>
              <span className="hidden md:inline">{rightMonth.getFullYear()}년 {rightMonth.getMonth() + 1}월</span>
            </div>
            <button onClick={handleNext} className="p-1 rounded-full hover:bg-muted transition-colors">
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-4">
            <CalendarMonth year={baseMonth.getFullYear()} month={baseMonth.getMonth()} checkIn={tempCheckIn} checkOut={tempCheckOut} today={today} onDateClick={handleDateClick} />
            <CalendarMonth year={rightMonth.getFullYear()} month={rightMonth.getMonth()} checkIn={tempCheckIn} checkOut={tempCheckOut} today={today} onDateClick={handleDateClick} />
          </div>
        </div>

        <div className="px-6 py-4 border-t shrink-0">
          <Button className="w-full py-6 rounded-xl text-base font-semibold" disabled={!canApply} onClick={handleApply}>
            적용하기
          </Button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── 인원 선택 모달 ──────────────────────────────────────────

interface GuestPickerModalProps {
  adults: number
  kids: number
  onApply: (adults: number, kids: number) => void
  onClose: () => void
}

export function GuestPickerModal({ adults, kids, onApply, onClose }: GuestPickerModalProps) {
  const [tempAdults, setTempAdults] = useState(adults)
  const [tempKids, setTempKids] = useState(kids)

  const handleApply = () => {
    onApply(tempAdults, tempKids)
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-background rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[420px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-bold">인원 선택</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <CounterRow label="성인" desc="만 13세 이상" value={tempAdults} min={1} max={10} onChange={setTempAdults} />
          <CounterRow label="아동" desc="만 12세 이하" value={tempKids} min={0} max={5} onChange={setTempKids} />
        </div>
        <div className="px-6 pb-6">
          <Button className="w-full py-6 rounded-xl text-base font-semibold" onClick={handleApply}>
            성인 {tempAdults}, 아동 {tempKids} 적용하기
          </Button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── 공용 컴포넌트 ──────────────────────────────────────────

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-end md:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:w-auto animate-fade-in-up">{children}</div>
    </div>
  )
}

function CounterRow({ label, desc, value, min, max, onChange }: {
  label: string; desc: string; value: number; min: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-base font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="flex items-center gap-4">
        <button disabled={value <= min} onClick={() => onChange(value - 1)} className={cn("size-9 rounded-full border-2 flex items-center justify-center transition-colors", value <= min ? "border-border/50 text-muted-foreground/30 cursor-not-allowed" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}>
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-lg font-bold">{value}</span>
        <button disabled={value >= max} onClick={() => onChange(value + 1)} className={cn("size-9 rounded-full border-2 flex items-center justify-center transition-colors", value >= max ? "border-border/50 text-muted-foreground/30 cursor-not-allowed" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ─── 캘린더 ─────────────────────────────────────────────────

function CalendarMonth({ year, month, checkIn, checkOut, today, onDateClick }: {
  year: number; month: number; checkIn: Date | null; checkOut: Date | null; today: Date; onDateClick: (date: Date) => void
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((day, i) => (
          <div key={day} className={cn("text-center text-xs font-medium py-2", i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-muted-foreground")}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-10" />
          const date = new Date(year, month, day)
          const isPast = date < today
          const isToday = isSameDay(date, today)
          const isCheckIn = checkIn ? isSameDay(date, checkIn) : false
          const isCheckOut = checkOut ? isSameDay(date, checkOut) : false
          const isSelected = isCheckIn || isCheckOut
          const isInRange = checkIn && checkOut ? isBetween(date, checkIn, checkOut) : false
          const dayOfWeek = date.getDay()
          return (
            <button key={day} disabled={isPast} onClick={() => onDateClick(date)} className={cn(
              "h-10 text-sm relative flex flex-col items-center justify-center transition-colors",
              isPast && "text-muted-foreground/30 cursor-not-allowed",
              !isPast && !isSelected && !isInRange && "hover:bg-muted rounded-full",
              !isPast && !isSelected && !isInRange && dayOfWeek === 0 && "text-red-400",
              !isPast && !isSelected && !isInRange && dayOfWeek === 6 && "text-blue-400",
              isInRange && "bg-primary/10",
              isSelected && "z-10",
            )}>
              {isSelected && <span className="absolute inset-1 bg-primary rounded-full" />}
              {isToday && !isSelected && <span className="absolute inset-1 border-2 border-primary rounded-full" />}
              <span className={cn("relative z-10", isSelected ? "text-white font-bold" : isToday && "text-primary font-bold")}>{day}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
