"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Calendar,
  Gift,
  ArrowLeft,
  ExternalLink,
  Eye,
  ChevronRight,
  Clock,
  Images,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { useEventList } from "../hooks/useEventList"
import type { BoardItem, BoardItemLink } from "@/domains/cs/types"

// ─── Date-based status (since API status codes like "BI005" are opaque) ───

type EventStatusInfo = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: typeof Clock
}

function getEventStatus(event: BoardItem): EventStatusInfo {
  const now = Date.now()
  const startMs = event.start_dt ? toMillis(event.start_dt) : 0
  const endMs = event.end_dt ? toMillis(event.end_dt) : 0

  if (startMs && now < startMs) {
    return { label: "예정", variant: "secondary", icon: Clock }
  }
  if (endMs && now > endMs) {
    return { label: "종료", variant: "destructive", icon: Clock }
  }
  return { label: "진행중", variant: "default", icon: Gift }
}

function isEnded(event: BoardItem): boolean {
  return getEventStatus(event).label === "종료"
}

// ─── HTML description renderer ───

function isHtml(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text)
}

function DescriptionRenderer({ text }: { text: string }) {
  if (isHtml(text)) {
    return (
      <div
        className="prose prose-sm max-w-none text-foreground/80 leading-relaxed
          [&_p]:my-2 [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-3"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }
  return (
    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
      {text}
    </p>
  )
}

// ─── Main component ───

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

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => {
          const status = getEventStatus(event)
          const ended = isEnded(event)
          return (
            <button
              key={event.key}
              onClick={() => setSelectedEvent(event)}
              className={cn(
                "group w-full text-left rounded-xl border bg-card overflow-hidden",
                "transition-all duration-200",
                ended
                  ? "opacity-60 grayscale hover:opacity-75"
                  : "hover:shadow-lg hover:-translate-y-0.5"
              )}
            >
              {/* Thumbnail from badge_image_url */}
              <div className="relative aspect-[2/1] bg-muted overflow-hidden">
                {event.badge_image_url ? (
                  <Image
                    src={event.badge_image_url}
                    alt={event.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300",
                      !ended && "group-hover:scale-105"
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Gift className="size-10 text-muted-foreground/30" />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={status.variant}
                    className="shadow-sm backdrop-blur-sm"
                  >
                    {status.label}
                  </Badge>
                </div>
                {/* View count */}
                {event.view_count != null && event.view_count > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-white/80 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                    <Eye className="size-3" />
                    {event.view_count.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  {event.title}
                </h3>
                {event.thumb_description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {event.thumb_description}
                  </p>
                )}
                {(event.start_dt || event.end_dt) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>
                      {formatTimestampDot(event.start_dt)} ~{" "}
                      {formatTimestampDot(event.end_dt)}
                    </span>
                  </div>
                )}
                {/* Arrow indicator */}
                <div className="flex justify-end mt-2">
                  <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
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

// ─── Detail view ───

function EventDetail({
  event,
  onBack,
}: {
  event: BoardItem
  onBack: () => void
}) {
  const status = getEventStatus(event)
  const StatusIcon = status.icon

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        이벤트 목록
      </button>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Hero image from detail_banner_image_url */}
        {event.detail_banner_image_url && (
          <div className="relative aspect-[2/1] bg-muted">
            <Image
              src={event.detail_banner_image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Status badge + type tag */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="size-3" />
              {status.label}
            </Badge>
            {event.type && (
              <Badge variant="outline" className="text-xs">
                {event.type}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold leading-snug">{event.title}</h2>

          {/* Date range */}
          {(event.start_dt || event.end_dt) && (
            <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
              <Calendar className="size-4 shrink-0" />
              <span>
                {formatTimestampDot(event.start_dt)} ~{" "}
                {formatTimestampDot(event.end_dt)}
              </span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="mt-5 pt-5 border-t" data-testid="event-description">
              <DescriptionRenderer text={event.description} />
            </div>
          )}

          {/* Image gallery from image_urls[] */}
          {event.image_urls && event.image_urls.length > 0 && (
            <div className="mt-6" data-testid="image-gallery">
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
                <Images className="size-4" />
                <span>이미지 갤러리</span>
              </div>
              <div className="grid gap-2">
                {event.image_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${event.title} 이미지 ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons from buttons[] */}
          {event.buttons && event.buttons.length > 0 && (
            <div className="mt-6 space-y-2" data-testid="cta-buttons">
              {event.buttons.map((btn: BoardItemLink, idx: number) => (
                <Button
                  key={idx}
                  className="w-full gap-2"
                  size="lg"
                  variant={idx === 0 ? "default" : "outline"}
                  asChild
                >
                  <a
                    href={btn.target}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Gift className="size-4" />
                    {btn.btn_name || "바로가기"}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {/* Webview link */}
          {event.webview_link && (
            <div className="mt-4">
              <Button
                variant="ghost"
                className="w-full gap-2 text-muted-foreground hover:text-foreground"
                size="lg"
                asChild
              >
                <a
                  href={event.webview_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
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
