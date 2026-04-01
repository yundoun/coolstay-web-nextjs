"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Gift,
  Eye,
  Clock,
  Sparkles,
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
  return { label: "진행중", variant: "default", icon: Sparkles }
}

type FilterTab = "전체" | "진행중" | "종료"

// ─── Main component ───

export function EventListPage() {
  const { events, isLoading, error } = useEventList()
  const [activeFilter, setActiveFilter] = useState<FilterTab>("전체")

  const filteredEvents = events.filter((event) => {
    if (activeFilter === "전체") return true
    return getEventStatus(event).label === activeFilter
  })

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">이벤트</h1>
        <LoadingSpinner />
      </Container>
    )
  }

  const [featured, ...rest] = filteredEvents

  return (
    <Container size="narrow" padding="responsive" className="py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">이벤트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          쿨스테이에서 준비한 특별한 혜택을 만나보세요
        </p>
      </div>

      {error && <ErrorState message={error} />}

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-6">
        {(["전체", "진행중", "종료"] as FilterTab[]).map((tab) => {
          const isActive = activeFilter === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {tab}
              {tab !== "전체" && (
                <span className={cn(
                  "ml-1.5 text-xs",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                )}>
                  {events.filter((e) => getEventStatus(e).label === tab).length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filteredEvents.length === 0 && !error && (
        <EmptyState icon={Gift} title="해당하는 이벤트가 없습니다" />
      )}

      {/* 피처드 카드 (첫 번째) */}
      {featured && <FeaturedCard event={featured} />}

      {/* 2열 그리드 (나머지) */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {rest.map((event) => (
            <EventGridCard key={event.key} event={event} />
          ))}
        </div>
      )}
    </Container>
  )
}

// ─── Featured hero card ───

function FeaturedCard({ event }: { event: BoardItem }) {
  const status = getEventStatus(event)
  const ended = status.label === "종료"
  const image =
    event.badge_image_url ||
    event.detail_banner_image_url ||
    event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        "group relative block rounded-2xl overflow-hidden",
        "transition-all duration-300",
        ended
          ? "opacity-70 hover:opacity-85"
          : "hover:shadow-2xl hover:-translate-y-1"
      )}
    >
      <div
        className={cn(
          "relative aspect-[2/1] bg-muted overflow-hidden",
          ended && "saturate-[0.2]"
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !ended && "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 100vw, 560px"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
            <Gift className="size-16 text-primary/20" />
          </div>
        )}

        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* 상태 배지 */}
        <div className="absolute top-4 left-4">
          <StatusDot status={status} size="lg" />
        </div>

        {/* 조회수 */}
        {event.view_count != null && event.view_count > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-white/70 bg-black/30 rounded-full px-2.5 py-1 backdrop-blur-sm">
            <Eye className="size-3" />
            {event.view_count.toLocaleString()}
          </div>
        )}

        {/* 하단 콘텐츠 */}
        <div className="absolute bottom-0 inset-x-0 p-5">
          <h2
            className={cn(
              "text-lg sm:text-xl font-extrabold text-white leading-snug line-clamp-2",
              "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]",
              ended && "text-white/70 line-through decoration-white/30"
            )}
          >
            {event.title}
          </h2>
          {event.thumb_description && (
            <p className="text-sm text-white/60 mt-1 line-clamp-1">
              {event.thumb_description}
            </p>
          )}
          {(event.start_dt || event.end_dt) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-white/50">
              <Calendar className="size-3" />
              {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
            </div>
          )}
        </div>

        {/* 종료 오버레이 */}
        {ended && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white/60 text-sm font-bold tracking-widest px-5 py-2 border-2 border-white/20 rounded-full backdrop-blur-sm">
              이벤트 종료
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

// ─── Grid card ───

function EventGridCard({ event }: { event: BoardItem }) {
  const status = getEventStatus(event)
  const ended = status.label === "종료"
  const image =
    event.badge_image_url ||
    event.detail_banner_image_url ||
    event.image_urls?.[0]

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        "group block rounded-xl overflow-hidden bg-card border",
        "transition-all duration-300",
        ended
          ? "opacity-60 hover:opacity-80"
          : "hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      {/* 이미지 */}
      <div
        className={cn(
          "relative aspect-[4/3] bg-muted overflow-hidden",
          ended && "saturate-[0.2]"
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !ended && "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 50vw, 280px"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted-foreground/5">
            <Gift className="size-8 text-muted-foreground/20" />
          </div>
        )}

        {/* 그라디언트 */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        {/* 조회수 */}
        {event.view_count != null && event.view_count > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] text-white/70 bg-black/30 rounded-full px-1.5 py-0.5 backdrop-blur-sm">
            <Eye className="size-2.5" />
            {event.view_count.toLocaleString()}
          </div>
        )}

        {/* 종료 오버레이 */}
        {ended && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-white/50 text-[10px] font-bold tracking-wider px-2.5 py-0.5 border border-white/20 rounded-full backdrop-blur-sm">
              종료
            </span>
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <StatusDot status={status} size="sm" />
        </div>
        <h3
          className={cn(
            "font-bold text-sm leading-snug line-clamp-2",
            ended
              ? "text-muted-foreground line-through decoration-muted-foreground/30"
              : "group-hover:text-primary transition-colors"
          )}
        >
          {event.title}
        </h3>
        {(event.start_dt || event.end_dt) && (
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
            {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
          </p>
        )}
      </div>
    </Link>
  )
}

// ─── Status dot indicator ───

function StatusDot({
  status,
  size = "sm",
}: {
  status: EventStatusInfo
  size?: "sm" | "lg"
}) {
  const isLg = size === "lg"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        isLg
          ? "text-xs px-3 py-1 bg-black/30 backdrop-blur-sm text-white"
          : "text-[11px]"
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          isLg ? "size-2" : "size-1.5",
          status.label === "진행중" && "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
          status.label === "예정" && "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]",
          status.label === "종료" && "bg-gray-400"
        )}
      />
      <span
        className={cn(
          isLg
            ? "text-white/90"
            : cn(
                status.label === "진행중" && "text-emerald-600 dark:text-emerald-400",
                status.label === "예정" && "text-blue-600 dark:text-blue-400",
                status.label === "종료" && "text-muted-foreground"
              )
        )}
      >
        {status.label}
      </span>
    </span>
  )
}
