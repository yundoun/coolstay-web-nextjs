"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Eye,
  Package,
  Sparkles,
  Clock,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { usePackageExhibitionList } from "../hooks/usePackageExhibitionList"
import type { BoardItem } from "@/domains/cs/types"

// ─── Status helper ───

function getChildStatus(item: BoardItem) {
  const now = Date.now()
  const startMs = item.start_dt ? toMillis(item.start_dt) : 0
  const endMs = item.end_dt ? toMillis(item.end_dt) : 0

  if (startMs && now < startMs) {
    return { label: "예정", variant: "secondary" as const, icon: Clock }
  }
  if (endMs && now > endMs) {
    return { label: "종료", variant: "destructive" as const, icon: Clock }
  }
  return { label: "진행중", variant: "default" as const, icon: Sparkles }
}

// ─── Child exhibition card ───

function ChildExhibitionCard({ item }: { item: BoardItem }) {
  const status = getChildStatus(item)
  const ended = status.label === "종료"

  return (
    <Link
      href={`/exhibitions/${item.key}?type=EXHIBITION`}
      className={cn(
        "group relative block rounded-2xl overflow-hidden",
        "bg-card border shadow-sm",
        "transition-all duration-300 ease-out",
        ended
          ? "opacity-50 grayscale"
          : "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {item.banner_image_url ? (
          <Image
            src={item.banner_image_url}
            alt={item.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !ended && "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Sparkles className="size-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={status.variant}
            className="gap-1 shadow-lg backdrop-blur-sm text-xs"
          >
            <status.icon className="size-3" />
            {status.label}
          </Badge>
        </div>

        {/* View count */}
        {item.view_count != null && item.view_count > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-white/90 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
            <Eye className="size-3" />
            {item.view_count.toLocaleString()}
          </div>
        )}

        {/* Title overlay on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 drop-shadow-md">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {item.thumb_description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
              {item.thumb_description}
            </p>
          )}
          {(item.start_dt || item.end_dt) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3 shrink-0" />
              <span>
                {formatTimestampDot(item.start_dt)} ~ {formatTimestampDot(item.end_dt)}
              </span>
            </div>
          )}
        </div>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground/40 transition-all duration-300",
            !ended && "group-hover:text-primary group-hover:translate-x-0.5"
          )}
        />
      </div>
    </Link>
  )
}

// ─── Main ───

export function PackageExhibitionPage({ groupKey }: { groupKey: number }) {
  const { menuTitle, exhibitions, isLoading, isError, refetch } =
    usePackageExhibitionList(groupKey)

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <LoadingSpinner />
      </Container>
    )
  }

  if (isError) {
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
          message="패키지 기획전을 불러오지 못했습니다"
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  // 첫 번째 아이템에서 패키지 그룹 자체의 배너 이미지 참조 가능
  // (API가 그룹 메타 정보를 별도로 주지 않으므로 menu_title 활용)
  const title = menuTitle || "패키지 기획전"
  const ongoingCount = exhibitions.filter((e) => {
    const now = Date.now()
    const endMs = e.end_dt ? toMillis(e.end_dt) : Infinity
    return now <= endMs
  }).length

  return (
    <div>
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <Container size="narrow" padding="responsive" className="pt-6 pb-8">
          {/* Back */}
          <Link
            href="/exhibitions"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            기획전 목록
          </Link>

          {/* Title area */}
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              <Package className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {exhibitions.length}개 기획전
                {ongoingCount > 0 && (
                  <span className="ml-1.5 text-primary font-medium">
                    · {ongoingCount}개 진행중
                  </span>
                )}
              </p>
            </div>
          </div>
        </Container>

        {/* Decorative bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Exhibition grid */}
      <Container size="narrow" padding="responsive" className="py-6">
        {exhibitions.length === 0 ? (
          <EmptyState icon={Sparkles} title="하위 기획전이 없습니다" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {exhibitions.map((item) => (
              <ChildExhibitionCard key={item.key} item={item} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
