"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Gift, ArrowLeft } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { useEventList } from "../hooks/useEventList"
import type { BoardItem } from "@/domains/cs/types"

function getEventStatus(event: BoardItem) {
  switch (event.status) {
    case "END":
    case "ENDED":
      return { label: "종료", variant: "destructive" as const }
    case "WAIT":
    case "SCHEDULED":
      return { label: "예정", variant: "secondary" as const }
    case "ACTIVE":
    default:
      return { label: "진행중", variant: "default" as const }
  }
}

function formatTs(ts?: number) {
  if (!ts) return ""
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function EventListPage() {
  const { events, isLoading, error } = useEventList()
  const [selectedEvent, setSelectedEvent] = useState<BoardItem | null>(null)

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
        <LoadingSpinner />
      </Container>
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">이벤트</h1>

      {error && <ErrorState message={error} />}

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
        <EmptyState icon={Gift} title="진행 중인 이벤트가 없습니다" />
      )}
    </Container>
  )
}

function EventDetail({
  event,
  onBack,
}: {
  event: BoardItem
  onBack: () => void
}) {
  const status = getEventStatus(event)
  const detailLink = event.web_view_link || event.link

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

          {detailLink && (
            <div className="mt-6">
              <Button className="w-full" size="lg" asChild>
                <a href={detailLink}>
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
