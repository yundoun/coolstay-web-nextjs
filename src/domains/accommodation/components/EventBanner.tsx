"use client"

import { CalendarDays, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MotelEvent } from "../types"

interface EventBannerProps {
  events: MotelEvent[]
}

export function EventBanner({ events }: EventBannerProps) {
  if (events.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">진행중인 이벤트</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl",
              "bg-gradient-to-r from-primary/5 to-primary/10",
              "border border-primary/20"
            )}
          >
            <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/10">
              <Gift className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {event.description}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3" />
                <span>
                  {event.startDate} ~ {event.endDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
