"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RentalTimeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accommodationId: string
  roomId: string
  roomName: string
  price: number
  maxHours?: number
}

// 대실 시간 옵션 생성 (현재 시각 기준 ~ 익일 새벽)
function generateTimeSlots() {
  const now = new Date()
  const currentHour = now.getHours()
  const slots: { label: string; value: string }[] = []

  // 현재 시각 다음 정시부터 ~ 자정까지
  for (let h = Math.max(currentHour + 1, 10); h <= 23; h++) {
    slots.push({
      label: `${String(h).padStart(2, "0")}:00`,
      value: `${h}`,
    })
  }

  return slots
}

export function RentalTimeModal({
  open,
  onOpenChange,
  accommodationId,
  roomId,
  roomName,
  price,
  maxHours = 4,
}: RentalTimeModalProps) {
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const timeSlots = generateTimeSlots()

  if (!open) return null

  const handleConfirm = () => {
    if (!selectedTime) return
    const endHour = parseInt(selectedTime) + maxHours
    router.push(
      `/booking/${accommodationId}?room=${roomId}&type=rental&startTime=${selectedTime}&endTime=${endHour}`
    )
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full md:w-auto animate-fade-in-up">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[90vw] md:max-w-[420px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div>
              <h2 className="text-lg font-bold">대실 시간 선택</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {roomName} · 최대 {maxHours}시간
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>
          </div>

          {/* Time Slots */}
          <div className="px-6 py-5">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              입실 시간을 선택해 주세요
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => setSelectedTime(slot.value)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium transition-all border",
                    selectedTime === slot.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-foreground border-transparent hover:border-primary/30"
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="mt-4 p-3 rounded-xl bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>
                    {selectedTime}:00 ~ {parseInt(selectedTime) + maxHours}:00
                  </span>
                  <span className="text-muted-foreground">({maxHours}시간)</span>
                </div>
                <span className="font-bold">{price.toLocaleString()}원</span>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div className="px-6 pb-6">
            <Button
              className="w-full py-6 rounded-xl text-base font-semibold"
              disabled={!selectedTime}
              onClick={handleConfirm}
            >
              {selectedTime
                ? `${selectedTime}:00 입실 · ${price.toLocaleString()}원 예약`
                : "시간을 선택해 주세요"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
