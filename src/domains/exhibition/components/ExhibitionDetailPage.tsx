"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Sparkles,
  ArrowLeft,
  Eye,
  Images,
  Share2,
  Tag,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { useExhibitionDetail } from "../hooks/useExhibitionDetail"
import type { BoardItem } from "@/domains/cs/types"

// ─── Date-based status (reused from list) ───

function getDetailStatus(item: BoardItem) {
  const now = Date.now()
  const startMs = item.start_dt ? toMillis(item.start_dt) : 0
  const endMs = item.end_dt ? toMillis(item.end_dt) : 0

  if (startMs && now < startMs) {
    return { label: "예정", variant: "secondary" as const }
  }
  if (endMs && now > endMs) {
    return { label: "종료", variant: "destructive" as const }
  }
  return { label: "진행중", variant: "default" as const }
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

// ─── Main ───

export function ExhibitionDetailPage({ exhibitionKey }: { exhibitionKey: number }) {
  const { exhibition, isLoading, isError, refetch } = useExhibitionDetail(exhibitionKey)

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <LoadingSpinner />
      </Container>
    )
  }

  if (isError || !exhibition) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <Link
          href="/exhibitions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          기획전 목록
        </Link>
        <ErrorState
          message="기획전을 불러오지 못했습니다"
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  const status = getDetailStatus(exhibition)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: exhibition.title,
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
        href="/exhibitions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        기획전 목록
      </Link>

      <article className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Hero image */}
        {exhibition.detail_banner_image_url && (
          <div className="relative aspect-[2/1] bg-muted">
            <Image
              src={exhibition.detail_banner_image_url}
              alt={exhibition.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Status + share */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={status.variant} className="gap-1">
                <Sparkles className="size-3" />
                {status.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                기획전
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="size-8" onClick={handleShare}>
              <Share2 className="size-4" />
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold leading-snug">{exhibition.title}</h1>

          {/* Thumb description */}
          {exhibition.thumb_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {exhibition.thumb_description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            {(exhibition.start_dt || exhibition.end_dt) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0" />
                {formatTimestampDot(exhibition.start_dt)} ~ {formatTimestampDot(exhibition.end_dt)}
              </span>
            )}
            {exhibition.view_count != null && (
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                조회 {exhibition.view_count.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sort tags */}
          {exhibition.sort_tags && exhibition.sort_tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {exhibition.sort_tags.map((tag) => (
                <Badge
                  key={tag.key}
                  variant="secondary"
                  className={cn(
                    "gap-1 text-xs font-normal",
                    "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Tag className="size-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {exhibition.description && exhibition.description !== "." && (
            <div className="mt-5 pt-5 border-t">
              <DescriptionRenderer text={exhibition.description} />
            </div>
          )}

          {/* Image gallery */}
          {exhibition.image_urls && exhibition.image_urls.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-muted-foreground">
                <Images className="size-4" />
                이미지 ({exhibition.image_urls.length})
              </div>
              <div className="space-y-2">
                {exhibition.image_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${exhibition.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 560px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Container>
  )
}
