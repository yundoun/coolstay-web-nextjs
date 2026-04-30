"use client"

import Image from "next/image"
import {
  Calendar,
  Gift,
  ExternalLink,
  Eye,
  Tag,
  Sparkles,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DetailHeroSkeleton } from "@/components/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot } from "@/lib/utils/formatDate"
import { useEventDetail } from "../hooks/useEventDetail"
import { getEventStatus } from "./EventListPage"
import type { BoardItemLink } from "@/domains/cs/types"

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

// ─── Main ───

export function EventDetailPage({ eventKey }: { eventKey: number }) {
  const { event, isLoading, isError, refetch } = useEventDetail(eventKey)

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <DetailHeroSkeleton imageAspect="aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1]" />
        <div className="space-y-3 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-60 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </Container>
    )
  }

  if (isError || !event) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <ErrorState
          message="이벤트를 불러오지 못했습니다"
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  const status = getEventStatus(event)
  const StatusIcon = status.icon

  // 히어로: 썸네일(badge) 우선, 없으면 상세 배너
  const heroImage =
    event.badge_image_url ||
    event.detail_banner_image_url

  // 상세 이미지: 세로로 긴 랜딩 이미지 (콘텐츠 자체)
  const detailImages = (event.image_urls ?? []).filter(
    (url) => url && url.trim() !== ""
  )

  const hasDescription =
    event.description && event.description !== "." && event.description.trim()
  const hasContent =
    hasDescription || detailImages.length > 0 || event.webview_link

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <article className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* ─── 히어로 이미지 ─── */}
        <div className="relative aspect-[2/1] bg-gray-900 overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/30 to-primary/5">
              <Gift className="size-20 text-white/10" />
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {/* 상태 + 타입 배지 */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={status.label === "진행중" ? "default" : status.label === "예정" ? "secondary" : "destructive"} className="gap-1">
              <StatusIcon className="size-3" />
              {status.label}
            </Badge>
            {event.type && (
              <Badge variant="outline" className="text-xs">
                <Tag className="size-3 mr-1" />
                {event.type}
              </Badge>
            )}
          </div>

          {/* 타이틀 */}
          <h1 className="text-xl font-bold leading-snug">{event.title}</h1>

          {/* 날짜 + 조회수 */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            {(event.start_dt || event.end_dt) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0" />
                {formatTimestampDot(event.start_dt)} ~{" "}
                {formatTimestampDot(event.end_dt)}
              </span>
            )}
            {event.view_count != null && (
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                {event.view_count.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* ─── 콘텐츠 영역 ─── */}
        <div className="border-t">
          <div className="p-5 sm:p-6">
            {/* 설명 텍스트 */}
            {hasDescription && (
              <div
                className={cn(
                  detailImages.length > 0 || event.webview_link
                    ? "pb-6 border-b border-border/50"
                    : ""
                )}
              >
                <DescriptionRenderer text={event.description!} />
              </div>
            )}

            {/* 콘텐츠 없을 때 */}
            {!hasContent && (
              <p className="text-sm text-muted-foreground text-center py-4">
                이벤트 상세 정보가 준비 중입니다.
              </p>
            )}
          </div>

          {/* 상세 이미지 — 풀너비 세로 스택 (콘텐츠 자체) */}
          {detailImages.length > 0 && (
            <div className="flex flex-col">
              {detailImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`${event.title} 상세 ${idx + 1}`}
                  className="w-full h-auto"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
          )}

          {/* 하단 영역 (링크 + CTA) */}
          {/* 하단 영역 (링크 + CTA) */}
          <div className="p-5 sm:p-6">
            {/* 웹뷰 링크 */}
            {event.webview_link && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl h-12 font-semibold border-2 hover:bg-muted/50"
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

            {/* CTA 버튼 */}
            {event.buttons && event.buttons.length > 0 && (
              <div className="flex gap-2 sm:gap-3">
                {event.buttons.map((btn: BoardItemLink, idx: number) => (
                  <Button
                    key={idx}
                    className={cn(
                      "flex-1 gap-2 rounded-xl h-12 font-bold",
                      idx === 0 &&
                        "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    )}
                    size="lg"
                    variant={idx === 0 ? "default" : "outline"}
                    asChild
                  >
                    <a
                      href={btn.target}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {idx === 0 ? (
                        <Sparkles className="size-4" />
                      ) : (
                        <Gift className="size-4" />
                      )}
                      {btn.btn_name || "바로가기"}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Container>
  )
}
