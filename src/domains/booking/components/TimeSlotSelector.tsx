"use client"

import { useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlotSelectorProps {
  selectedTime: string
  onSelectTime: (time: string) => void
}

const TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

export function TimeSlotSelector({
  selectedTime,
  onSelectTime,
}: TimeSlotSelectorProps) {
  const now = new Date()
  const currentHour = now.getHours()

  // Determine which slots are available (past times are disabled)
  const isSlotAvailable = (slot: string) => {
    const slotHour = parseInt(slot.split(":")[0], 10)
    return slotHour > currentHour
  }

  // Check if selected time leaves less than rental duration (4h)
  const selectedHour = parseInt(selectedTime.split(":")[0], 10)
  const isLateWarning = selectedHour >= 17

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">대실 입실 시간</h3>
      </div>

      {/* Horizontal scrollable time slots */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {TIME_SLOTS.map((slot) => {
          const available = isSlotAvailable(slot)
          const isSelected = slot === selectedTime

          return (
            <button
              key={slot}
              type="button"
              disabled={!available}
              onClick={() => onSelectTime(slot)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border whitespace-nowrap",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : available
                    ? "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    : "bg-muted text-muted-foreground/50 border-muted cursor-not-allowed"
              )}
            >
              {slot}
            </button>
          )
        })}
      </div>

      {/* Late warning */}
      {isLateWarning && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            선택하신 시간은 대실 종료 시간에 가깝습니다. 이용 가능 시간이 짧을 수 있으니 참고해 주세요.
          </p>
        </div>
      )}
    </div>
  )
}
