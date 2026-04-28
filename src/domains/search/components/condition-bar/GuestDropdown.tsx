"use client"

import { useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GuestDropdown({
  adults,
  onGuestChange,
  onClose,
}: {
  adults: number
  onGuestChange: (adults: number) => void
  onClose: () => void
}) {
  const [localAdults, setLocalAdults] = useState(adults)

  return (
    <div className="absolute left-0 top-full mt-2 z-50 bg-background rounded-xl shadow-xl border w-[360px] overflow-hidden animate-fade-in-down">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <h3 className="text-sm font-bold">인원 선택</h3>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-muted">
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>
      <div className="px-5 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">성인</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={localAdults <= 1}
              onClick={() => setLocalAdults(localAdults - 1)}
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center",
                localAdults <= 1
                  ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
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
                  ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
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
          onClick={() => onGuestChange(localAdults)}
        >
          성인 {localAdults}명 적용하기
        </Button>
      </div>
    </div>
  )
}
