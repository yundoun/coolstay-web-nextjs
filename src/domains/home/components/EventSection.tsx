"use client"

import Image from "next/image"
import Link from "next/link"
import { Gift, ArrowRight, Eye, Sparkles, Clock, Calendar } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { getEventList } from "@/domains/event/api/eventApi"
import type { BoardItem } from "@/domains/cs/types"

function getStatus(event: BoardItem) {
  const now = Date.now()
  const start = event.start_dt ? toMillis(event.start_dt) : 0
  const end = event.end_dt ? toMillis(event.end_dt) : 0

  if (start && now < start)
    return { label: "예정" as const, color: "blue" as const }
  if (end && now > end)
    return { label: "종료" as const, color: "gray" as const }
  return { label: "진행중" as const, color: "emerald" as const }
}

export function EventSection() {
  const { data } = useQuery({
    queryKey: ["home", "events"],
    queryFn: () => getEventList({ count: 10 }),
    staleTime: 5 * 60 * 1000,
  })

  const allEvents = data?.board_items ?? []

  // 홈에서는 진행중/예정만 노출 — 종료 이벤트는 목록 페이지에서
  const activeEvents = allEvents.filter(
    (e) => getStatus(e).label !== "종료"
  )

  if (activeEvents.length === 0) return null

  // 1개면 풀너비 피처드, 2개 이상이면 캐러셀
  if (activeEvents.length === 1) {
    return (
      <div>
        <FeaturedEventCard event={activeEvents[0]} />
        <MoreEventsLink />
      </div>
    )
  }

  return (
    <div>
      <div
        className={cn(
          "flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
      >
        {activeEvents.map((event, idx) => (
          <EventCard key={event.key} event={event} priority={idx === 0} />
        ))}
      </div>
      <MoreEventsLink />
    </div>
  )
}

/** 전체보기 링크 */
function MoreEventsLink() {
  return (
    <div className="flex justify-end mt-3">
      <Link
        href="/events"
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        전체 이벤트 보기
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}

/** 이벤트 1개일 때 풀너비 카드 */
function FeaturedEventCard({ event }: { event: BoardItem }) {
  const status = getStatus(event)
  const image =
    event.detail_banner_image_url ||
    event.badge_image_url ||
    event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[2.2/1] bg-muted overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 600px"
            priority
          />
        ) : (
          <EventImageFallback title={event.title} color={status.color} />
        )}

        {/* 하단 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* 상태 배지 */}
        <StatusBadge status={status} className="absolute top-3 left-3" />

        {/* 조회수 */}
        <ViewCount count={event.view_count} className="absolute top-3 right-3" />

        {/* 하단 정보 */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
          <h4 className="font-bold text-base sm:text-lg text-white leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {event.title}
          </h4>
          {event.thumb_description && (
            <p className="text-xs sm:text-sm text-white/65 mt-1 line-clamp-1">
              {event.thumb_description}
            </p>
          )}
          {(event.start_dt || event.end_dt) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-white/50">
              <Calendar className="size-3" />
              {formatTimestampDot(event.start_dt)} ~{" "}
              {formatTimestampDot(event.end_dt)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

/** 캐러셀용 이벤트 카드 */
function EventCard({
  event,
  priority,
}: {
  event: BoardItem
  priority?: boolean
}) {
  const status = getStatus(event)
  const image =
    event.detail_banner_image_url ||
    event.badge_image_url ||
    event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        "group relative flex-shrink-0 snap-start",
        "w-[280px] sm:w-[320px] rounded-2xl overflow-hidden",
        "bg-card border border-border/40",
        "transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:border-border"
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 280px, 320px"
            priority={priority}
          />
        ) : (
          <EventImageFallback title={event.title} color={status.color} />
        )}

        {/* 상태 배지 */}
        <StatusBadge status={status} className="absolute top-2.5 left-2.5" />

        {/* 조회수 */}
        <ViewCount count={event.view_count} className="absolute top-2.5 right-2.5" />
      </div>

      {/* 텍스트 영역 */}
      <div className="p-3.5">
        <h4 className="font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h4>
        {event.thumb_description && (
          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
            {event.thumb_description}
          </p>
        )}
        {(event.start_dt || event.end_dt) && (
          <p className="text-[11px] mt-2 text-muted-foreground/60 font-medium">
            {formatTimestampDot(event.start_dt)} ~{" "}
            {formatTimestampDot(event.end_dt)}
          </p>
        )}
      </div>
    </Link>
  )
}

/** 이미지 없을 때 그라데이션 fallback */
function EventImageFallback({
  title,
  color,
}: {
  title: string
  color: "emerald" | "blue" | "gray"
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full gap-2 px-4",
        color === "emerald" && "bg-gradient-to-br from-emerald-500/20 to-emerald-600/5",
        color === "blue" && "bg-gradient-to-br from-blue-500/20 to-blue-600/5",
        color === "gray" && "bg-gradient-to-br from-muted to-muted-foreground/5"
      )}
    >
      <Gift
        className={cn(
          "size-8",
          color === "emerald" && "text-emerald-500/30",
          color === "blue" && "text-blue-500/30",
          color === "gray" && "text-muted-foreground/20"
        )}
      />
      <p className="text-xs text-muted-foreground/40 text-center line-clamp-1 max-w-[80%]">
        {title}
      </p>
    </div>
  )
}

/** 상태 배지 */
function StatusBadge({
  status,
  className,
}: {
  status: { label: string; color: string }
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm",
        status.color === "emerald" && "bg-emerald-500/90 text-white",
        status.color === "blue" && "bg-blue-500/90 text-white",
        status.color === "gray" && "bg-gray-500/70 text-white/80",
        className
      )}
    >
      {status.label === "진행중" ? (
        <Sparkles className="size-2.5" />
      ) : (
        <Clock className="size-2.5" />
      )}
      {status.label}
    </span>
  )
}

/** 조회수 표시 */
function ViewCount({
  count,
  className,
}: {
  count?: number
  className?: string
}) {
  if (count == null || count <= 0) return null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] text-white/80 bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-sm",
        className
      )}
    >
      <Eye className="size-2.5" />
      {count.toLocaleString()}
    </span>
  )
}
