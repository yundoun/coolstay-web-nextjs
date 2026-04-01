"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Gift, Clock, ChevronRight, ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { getEventList } from "@/domains/event/api/eventApi"
import type { BoardItem } from "@/domains/cs/types"

function getStatus(event: BoardItem) {
  const now = Date.now()
  const start = event.start_dt ? toMillis(event.start_dt) : 0
  const end = event.end_dt ? toMillis(event.end_dt) : 0

  if (start && now < start) return { label: "예정", variant: "secondary" as const }
  if (end && now > end) return { label: "종료", variant: "destructive" as const }
  return { label: "진행중", variant: "default" as const }
}

export function EventSection() {
  const { data } = useQuery({
    queryKey: ["home", "events"],
    queryFn: () => getEventList({ count: 10 }),
    staleTime: 5 * 60 * 1000,
  })

  const allEvents = data?.board_items ?? []

  // 진행중/예정을 먼저, 종료를 뒤에 — 최대 6개
  const active = allEvents.filter((e) => getStatus(e).label !== "종료")
  const ended = allEvents.filter((e) => getStatus(e).label === "종료")
  const events = [...active, ...ended].slice(0, 6)

  if (events.length === 0) return null

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <Link
          href="/events"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          전체보기
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {events.map((event) => (
          <EventCard key={event.key} event={event} />
        ))}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: BoardItem }) {
  const status = getStatus(event)
  const isEnded = status.label === "종료"
  const image = event.badge_image_url || event.detail_banner_image_url || event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        "group flex gap-3 p-3 rounded-xl border bg-card",
        "transition-all duration-200",
        isEnded
          ? "opacity-60 hover:opacity-80"
          : "hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* 이미지 */}
      <div className={cn(
        "relative w-24 h-20 sm:w-28 sm:h-[72px] rounded-lg overflow-hidden shrink-0 bg-muted",
        isEnded && "grayscale"
      )}>
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              !isEnded && "group-hover:scale-105"
            )}
            sizes="112px"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Gift className="size-6 text-muted-foreground/30" />
          </div>
        )}
        <Badge
          variant={status.variant}
          className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0 h-5"
        >
          {status.label}
        </Badge>
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h4 className={cn(
            "font-semibold text-sm leading-snug line-clamp-1 transition-colors",
            isEnded ? "text-muted-foreground" : "group-hover:text-primary"
          )}>
            {event.title}
          </h4>
          {event.thumb_description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {event.thumb_description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="size-3" />
            {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
          </span>
          <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}
