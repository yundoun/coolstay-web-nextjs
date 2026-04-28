"use client"

import { useState, useMemo } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DAYS, formatDateKr, formatDateParam, diffDays, isSameDay, isBetween } from "./date-utils"

export function DateDropdown({
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
    <div className="absolute left-0 top-full mt-2 z-50 bg-background rounded-xl shadow-xl border w-[700px] overflow-hidden animate-fade-in-down">
      {/* 체크인/아웃 요약 */}
      <div className="flex items-center justify-center gap-5 py-4 border-b">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-0.5">체크인</p>
          <p className="text-base font-bold">{formatDateKr(effectiveCheckIn)}</p>
        </div>
        <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {nights > 0 ? `${nights}박` : "-"}
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-0.5">체크아웃</p>
          <p className="text-base font-bold">
            {selectedCheckOut ? formatDateKr(effectiveCheckOut) : "-"}
          </p>
        </div>
        <button onClick={onClose} className="absolute right-4 p-0.5 rounded-full hover:bg-muted">
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* 캘린더 네비게이션 */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1">
        <button onClick={handlePrev} className="p-1 rounded-full hover:bg-muted">
          <ChevronLeft className="size-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <span>{baseMonth.getFullYear()}년 {baseMonth.getMonth() + 1}월</span>
          <span className="text-muted-foreground/40">|</span>
          <span>{rightMonth.getFullYear()}년 {rightMonth.getMonth() + 1}월</span>
        </div>
        <button onClick={handleNext} className="p-1 rounded-full hover:bg-muted">
          <ChevronRight className="size-4 text-muted-foreground" />
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
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-muted-foreground"
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
                isPast && "text-muted-foreground/30 cursor-not-allowed",
                !isPast && !isSelected && !isInRange && "hover:bg-muted rounded-full",
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
