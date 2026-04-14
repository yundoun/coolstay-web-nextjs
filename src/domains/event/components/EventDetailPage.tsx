"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Gift,
  ArrowLeft,
  ExternalLink,
  Eye,
  Share2,
  Tag,
  Sparkles,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          이벤트 목록
        </Link>
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen">
      {/* ─── 히어로 섹션 (풀블리드) ─── */}
      <div className="relative">
        {/* 히어로 이미지 (썸네일 배너) */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] lg:aspect-[5/2] bg-gray-900 overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/30 to-primary/5">
              <Gift className="size-20 text-white/10" />
            </div>
          )}

          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        </div>

        {/* 플로팅 뒤로가기 */}
        <Link
          href="/events"
          className={cn(
            "absolute top-4 left-4 z-10",
            "flex items-center justify-center size-10 rounded-full",
            "bg-black/30 backdrop-blur-md text-white/90",
            "hover:bg-black/50 transition-colors",
            "shadow-lg"
          )}
        >
          <ArrowLeft className="size-5" />
        </Link>

        {/* 플로팅 공유 버튼 */}
        <button
          onClick={handleShare}
          className={cn(
            "absolute top-4 right-4 z-10",
            "flex items-center justify-center size-10 rounded-full",
            "bg-black/30 backdrop-blur-md text-white/90",
            "hover:bg-black/50 transition-colors",
            "shadow-lg"
          )}
        >
          <Share2 className="size-4" />
        </button>

        {/* 히어로 위 텍스트 오버레이 */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8">
          <Container size="narrow" padding="none">
            {/* 상태 + 타입 배지 */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm",
                  status.label === "진행중" &&
                    "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30",
                  status.label === "예정" &&
                    "bg-blue-500/90 text-white shadow-lg shadow-blue-500/30",
                  status.label === "종료" && "bg-muted-foreground/80 text-white/80"
                )}
              >
                <StatusIcon className="size-3" />
                {status.label}
              </span>
              {event.type && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/80">
                  <Tag className="size-3" />
                  {event.type}
                </span>
              )}
            </div>

            {/* 타이틀 */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              {event.title}
            </h1>

            {/* 날짜 + 조회수 */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {(event.start_dt || event.end_dt) && (
                <span className="flex items-center gap-1.5 text-xs text-white/60">
                  <Calendar className="size-3.5" />
                  {formatTimestampDot(event.start_dt)} ~{" "}
                  {formatTimestampDot(event.end_dt)}
                </span>
              )}
              {event.view_count != null && (
                <span className="flex items-center gap-1 text-xs text-white/50">
                  <Eye className="size-3.5" />
                  {event.view_count.toLocaleString()}
                </span>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* ─── 콘텐츠 영역 ─── */}
      <Container size="narrow" padding="responsive">
        <div className="relative -mt-8 bg-background rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.1)] min-h-[120px]">
          <div className="p-5 sm:p-8">
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
          <div className="p-5 sm:p-8">
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

            {/* CTA 버튼 — 인라인 (모바일/데스크탑 공통) */}
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
      </Container>
    </div>
  )
}
