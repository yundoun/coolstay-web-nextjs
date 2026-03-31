"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Gift, ArrowLeft, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEventList } from "../hooks/useEventList"
import type { EventBoardItem } from "../types"

function getEventStatus(event: EventBoardItem) {
  const now = Date.now()
  if (event.end_dt && event.end_dt < now) return { label: "종료", variant: "destructive" as const }
  if (event.start_dt && event.start_dt > now) return { label: "예정", variant: "secondary" as const }
  return { label: "진행중", variant: "default" as const }
}

function formatTs(ts?: number) {
  if (!ts) return ""
  const d = new Date(ts < 1e12 ? ts * 1000 : ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function EventListPage() {
  const { events, isLoading, error } = useEventList()
  const [selectedEvent, setSelectedEvent] = useState<EventBoardItem | null>(null)

  if (selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    )
  }

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">이벤트</h1>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">이벤트</h1>

      {error && <div className="text-center py-8 text-destructive text-sm">{error}</div>}

      <div className="space-y-4">
        {events.map((event) => {
          const status = getEventStatus(event)
          const isEnded = status.label === "종료"
          return (
            <button
              key={event.key}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              {event.banner_image_url && (
                <div className="relative aspect-[2/1] bg-muted">
                  <Image
                    src={event.banner_image_url}
                    alt={event.title}
                    fill
                    className={cn("object-cover", isEnded && "opacity-50 grayscale")}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{formatTs(event.start_dt)} ~ {formatTs(event.end_dt)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {events.length === 0 && !error && (
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
  event: EventBoardItem
  onBack: () => void
}) {
  const status = getEventStatus(event)

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
        {event.banner_image_url && (
          <div className="relative aspect-[2/1] bg-muted">
            <Image
              src={event.banner_image_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h2 className="text-lg font-bold leading-snug">{event.title}</h2>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>{formatTs(event.start_dt)} ~ {formatTs(event.end_dt)}</span>
          </div>

          <div className="mt-5 pt-5 border-t">
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {event.link && status.label === "진행중" && (
            <div className="mt-6">
              <Button className="w-full" size="lg" asChild>
                <a href={event.link}>
                  <Gift className="size-4 mr-2" />
                  자세히 보기
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
