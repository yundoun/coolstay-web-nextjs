"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Gift,
  ArrowLeft,
  ExternalLink,
  Eye,
  Images,
  Share2,
  Tag,
  Sparkles,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
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
  const heroImage =
    event.detail_banner_image_url ||
    event.badge_image_url ||
    event.image_urls?.[0]

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
    <div className="min-h-screen bg-muted/30">
      {/* ─── 히어로 섹션 (풀블리드) ─── */}
      <div className="relative">
        {/* 히어로 이미지 */}
        <div className="relative aspect-[16/10] sm:aspect-[2/1] max-h-[480px] bg-gray-900 overflow-hidden">
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
                  status.label === "종료" &&
                    "bg-gray-500/80 text-white/80"
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
                  {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
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

      {/* ─── 콘텐츠 카드 (히어로 위로 겹침) ─── */}
      <Container size="narrow" padding="responsive">
        <div className="relative -mt-4 bg-background rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] min-h-[200px]">
          <div className="p-5 sm:p-8">
            {/* 설명 */}
            {event.description && event.description !== "." && (
              <div className="pb-6 border-b border-border/50">
                <DescriptionRenderer text={event.description} />
              </div>
            )}

            {/* 이미지 갤러리 (횡스크롤) */}
            {event.image_urls && event.image_urls.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-1.5 mb-3 text-sm font-semibold text-foreground">
                  <Images className="size-4 text-primary" />
                  이미지
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    {event.image_urls.length}장
                  </span>
                </div>
                <div
                  className={cn(
                    "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  )}
                >
                  {event.image_urls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative flex-shrink-0 snap-start w-[280px] sm:w-[360px] aspect-[16/10] rounded-xl overflow-hidden bg-muted shadow-sm"
                    >
                      <Image
                        src={url}
                        alt={`${event.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 280px, 360px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 웹뷰 링크 (아웃라인 버튼) */}
            {event.webview_link && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl h-12 font-semibold border-2 hover:bg-muted/50"
                  asChild
                >
                  <a href={event.webview_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    자세히 보기
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 여백 (sticky bar가 가리는 영역) */}
        {event.buttons && event.buttons.length > 0 && (
          <div className="h-24 sm:h-0" />
        )}
      </Container>

      {/* ─── CTA 스티키 바 (모바일: 하단 고정, 데스크탑: 인라인) ─── */}
      {event.buttons && event.buttons.length > 0 && (
        <>
          {/* 모바일: 고정 하단 바 */}
          <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden">
            <div className="bg-background/95 backdrop-blur-lg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="flex gap-2">
                {event.buttons.map((btn: BoardItemLink, idx: number) => (
                  <Button
                    key={idx}
                    className={cn(
                      "flex-1 gap-2 rounded-xl h-12 font-bold text-sm",
                      idx === 0 &&
                        "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    )}
                    variant={idx === 0 ? "default" : "outline"}
                    asChild
                  >
                    <a href={btn.target} target="_blank" rel="noopener noreferrer">
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
            </div>
          </div>

          {/* 데스크탑: 인라인 */}
          <Container size="narrow" padding="responsive" className="hidden sm:block pb-8">
            <div className="bg-background rounded-b-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5">
              <div className="flex gap-3">
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
                    <a href={btn.target} target="_blank" rel="noopener noreferrer">
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
            </div>
          </Container>
        </>
      )}
    </div>
  )
}
