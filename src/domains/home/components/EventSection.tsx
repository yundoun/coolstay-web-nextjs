"use client"

import Image from "next/image"
import Link from "next/link"
import { Gift, ArrowRight } from "lucide-react"
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

  // 진행중/예정을 먼저, 종료를 뒤에 — 최대 8개
  const active = allEvents.filter((e) => getStatus(e).label !== "종료")
  const ended = allEvents.filter((e) => getStatus(e).label === "종료")
  const events = [...active, ...ended].slice(0, 8)

  if (events.length === 0) return null

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <Link
          href="/events"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          전체보기
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 횡스크롤 카드 캐러셀 */}
      <div
        className={cn(
          "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2",
          // 스크롤바 숨김
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
      >
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
  const isUpcoming = status.label === "예정"
  const image =
    event.badge_image_url ||
    event.detail_banner_image_url ||
    event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        "group relative flex-shrink-0 snap-start",
        "w-[200px] sm:w-[240px] rounded-2xl overflow-hidden",
        "transition-all duration-300",
        isEnded
          ? "opacity-70 hover:opacity-90"
          : "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* 이미지 영역 */}
      <div
        className={cn(
          "relative aspect-[3/4] bg-muted overflow-hidden",
          isEnded && "saturate-[0.3]"
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !isEnded && "group-hover:scale-110"
            )}
            sizes="(max-width: 640px) 200px, 240px"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted-foreground/10">
            <Gift className="size-10 text-muted-foreground/30" />
          </div>
        )}

        {/* 그라디언트 오버레이 (하단) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* 상단 그라디언트 (배지 가독성) */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />

        {/* 상태 배지 (좌상단) */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={status.variant}
            className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 shadow-lg backdrop-blur-sm border-0",
              status.label === "진행중" &&
                "bg-emerald-500 text-white shadow-emerald-500/40",
              status.label === "예정" &&
                "bg-blue-500 text-white shadow-blue-500/40",
              status.label === "종료" &&
                "bg-gray-500/80 text-white/90"
            )}
          >
            {status.label}
          </Badge>
        </div>

        {/* 하단 텍스트 오버레이 */}
        <div className="absolute bottom-0 inset-x-0 p-3.5">
          <h4
            className={cn(
              "font-bold text-sm leading-snug line-clamp-2 text-white",
              "drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
              isEnded && "text-white/70"
            )}
          >
            {event.title}
          </h4>
          {(event.start_dt || event.end_dt) && (
            <p
              className={cn(
                "text-[10px] mt-1.5 font-medium",
                isEnded ? "text-white/40" : "text-white/60"
              )}
            >
              {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
            </p>
          )}
        </div>

        {/* 종료 오버레이 */}
        {isEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-white/50 text-xs font-bold tracking-wider uppercase px-3 py-1 border border-white/20 rounded-full backdrop-blur-sm">
              종료
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
