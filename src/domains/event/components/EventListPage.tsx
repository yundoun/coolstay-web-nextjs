"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Gift, ArrowLeft } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { eventsMock } from "../data/mock"
import type { EventItem } from "../types"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  ongoing: { label: "진행중", variant: "default" },
  upcoming: { label: "예정", variant: "secondary" },
  ended: { label: "종료", variant: "destructive" },
}

export function EventListPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)

  if (selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">이벤트</h1>

      <div className="space-y-4">
        {eventsMock.map((event) => {
          const status = statusLabels[event.status]
          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[2/1] bg-muted">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className={cn(
                    "object-cover",
                    event.status === "ended" && "opacity-50 grayscale"
                  )}
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>
                    {event.startDate} ~ {event.endDate}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {eventsMock.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Gift className="size-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">진행 중인 이벤트가 없습니다</p>
        </div>
      )}
    </Container>
  )
}

function EventDetail({
  event,
  onBack,
}: {
  event: EventItem
  onBack: () => void
}) {
  const status = statusLabels[event.status]

  const handleCouponDownload = () => {
    alert(`"${event.couponName}" 쿠폰이 발급되었습니다!`)
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        이벤트 목록
      </button>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="relative aspect-[2/1] bg-muted">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h2 className="text-lg font-bold leading-snug">{event.title}</h2>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              {event.startDate} ~ {event.endDate}
            </span>
          </div>

          <div className="mt-5 pt-5 border-t">
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {event.hasCoupon && event.status === "ongoing" && (
            <div className="mt-6">
              <Button
                onClick={handleCouponDownload}
                className="w-full"
                size="lg"
              >
                <Gift className="size-4 mr-2" />
                쿠폰 받기
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
