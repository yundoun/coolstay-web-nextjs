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
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
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
        <LoadingSpinner />
      </Container>
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
    <Container size="narrow" padding="responsive" className="py-8">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        이벤트 목록
      </Link>

      <article className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Hero image */}
        {event.detail_banner_image_url && (
          <div className="relative aspect-[2/1] bg-muted">
            <Image
              src={event.detail_banner_image_url}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Status + type + share */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
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
            <Button variant="ghost" size="icon" className="size-8" onClick={handleShare}>
              <Share2 className="size-4" />
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold leading-snug">{event.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            {(event.start_dt || event.end_dt) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0" />
                {formatTimestampDot(event.start_dt)} ~ {formatTimestampDot(event.end_dt)}
              </span>
            )}
            {event.view_count != null && (
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                조회 {event.view_count.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          {event.description && event.description !== "." && (
            <div className="mt-5 pt-5 border-t">
              <DescriptionRenderer text={event.description} />
            </div>
          )}

          {/* Image gallery */}
          {event.image_urls && event.image_urls.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
                <Images className="size-4" />
                이미지 ({event.image_urls.length})
              </div>
              <div className="space-y-2">
                {event.image_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${event.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 560px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          {event.buttons && event.buttons.length > 0 && (
            <div className="mt-6 space-y-2">
              {event.buttons.map((btn: BoardItemLink, idx: number) => (
                <Button
                  key={idx}
                  className="w-full gap-2"
                  size="lg"
                  variant={idx === 0 ? "default" : "outline"}
                  asChild
                >
                  <a href={btn.target} target="_blank" rel="noopener noreferrer">
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
                <a href={event.webview_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                  자세히 보기
                </a>
              </Button>
            </div>
          )}
        </div>
      </article>
    </Container>
  )
}
