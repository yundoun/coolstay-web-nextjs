"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Gift,
  Eye,
  ChevronRight,
  Clock,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { useEventList } from "../hooks/useEventList"
import type { BoardItem } from "@/domains/cs/types"

// ─── Date-based status ───

export type EventStatusInfo = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: typeof Clock
}

export function getEventStatus(event: BoardItem): EventStatusInfo {
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

// ─── Main component ───

export function EventListPage() {
  const { events, isLoading, error } = useEventList()

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
          const ended = status.label === "종료"
          return (
            <Link
              key={event.key}
              href={`/events/${event.key}`}
              className={cn(
                "group block rounded-xl border bg-card overflow-hidden",
                "transition-all duration-200",
                ended
                  ? "opacity-60 grayscale hover:opacity-75"
                  : "hover:shadow-lg hover:-translate-y-0.5"
              )}
            >
              {/* Thumbnail */}
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
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Gift className="size-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant={status.variant} className="shadow-sm backdrop-blur-sm">
                    {status.label}
                  </Badge>
                </div>
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
                      {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {events.length === 0 && !error && (
        <EmptyState icon={Gift} title="진행 중인 이벤트가 없습니다" />
      )}
    </Container>
  )
}
