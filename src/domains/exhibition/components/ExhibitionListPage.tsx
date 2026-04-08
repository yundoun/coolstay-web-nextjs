"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Sparkles,
  Eye,
  ChevronRight,
  Clock,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { formatTimestampDot, toMillis } from "@/lib/utils/formatDate"
import { useExhibitionList } from "../hooks/useExhibitionList"
import type { Exhibition } from "@/lib/api/types"

// ─── Date-based status ───

export type ExhibitionStatusInfo = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: typeof Clock
}

export function getExhibitionStatus(item: Exhibition): ExhibitionStatusInfo {
  const now = Date.now()
  const startMs = item.start_dt ? toMillis(item.start_dt) : 0
  const endMs = item.end_dt ? toMillis(item.end_dt) : 0

  if (startMs && now < startMs) {
    return { label: "예정", variant: "secondary", icon: Clock }
  }
  if (endMs && now > endMs) {
    return { label: "종료", variant: "destructive", icon: Clock }
  }
  return { label: "진행중", variant: "default", icon: Sparkles }
}

// ─── Main component ───

export function ExhibitionListPage() {
  const { exhibitions, isLoading, error } = useExhibitionList()

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">기획전</h1>
        <LoadingSpinner />
      </Container>
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">기획전</h1>

      {error && <ErrorState message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {exhibitions.map((item) => {
          const status = getExhibitionStatus(item)
          const ended = status.label === "종료"
          return (
            <Link
              key={item.key}
              href={`/exhibitions/${item.key}?type=${item.type || "EXHIBITION"}`}
              className={cn(
                "group block rounded-xl border bg-card overflow-hidden",
                "transition-all duration-200",
                ended
                  ? "opacity-60 grayscale hover:opacity-75"
                  : "hover:shadow-lg hover:-translate-y-0.5"
              )}
            >
              {/* Thumbnail — banner_image_url for exhibitions */}
              <div className="relative aspect-[2/1] bg-muted overflow-hidden">
                {item.banner_image_url ? (
                  <Image
                    src={item.banner_image_url}
                    alt={item.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300",
                      !ended && "group-hover:scale-105"
                    )}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Sparkles className="size-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant={status.variant} className="shadow-sm backdrop-blur-sm">
                    {status.label}
                  </Badge>
                </div>
                {item.view_count != null && item.view_count > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-white/80 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                    <Eye className="size-3" />
                    {item.view_count.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>
                {(item.start_dt || item.end_dt) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>
                      {formatTimestampDot(item.start_dt)} ~ {formatTimestampDot(item.end_dt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {exhibitions.length === 0 && !error && (
        <EmptyState icon={Sparkles} title="진행 중인 기획전이 없습니다" />
      )}
    </Container>
  )
}
