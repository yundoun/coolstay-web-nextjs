"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Container } from "@/components/layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { getGuideList } from "@/domains/cs/api/csApi"
import { formatTimestampDot } from "@/lib/utils/formatDate"
import type { BoardItem } from "@/domains/cs/types"

export function GuidePage() {
  const [selectedGuide, setSelectedGuide] = useState<BoardItem | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["guide", "list"],
    queryFn: () => getGuideList({ count: 20 }),
  })

  const guides = data?.board_items ?? []

  if (selectedGuide) {
    return (
      <GuideDetail
        guide={selectedGuide}
        onBack={() => setSelectedGuide(null)}
      />
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200">
          <BookOpen className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">꿀팁 가이드</h1>
          <p className="text-sm text-muted-foreground">유용한 팁과 정보를 확인하세요</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorState
          message="가이드를 불러오지 못했습니다"
          onRetry={() => refetch()}
        />
      ) : guides.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="등록된 가이드가 없습니다"
          description="새로운 가이드가 곧 업데이트됩니다."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => {
            const thumbnail = guide.image_urls?.[0]
            return (
              <button
                key={guide.key}
                onClick={() => setSelectedGuide(guide)}
                className="group w-full text-left rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                {thumbnail ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    <Image
                      src={thumbnail}
                      alt={guide.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 280px"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-[16/9] w-full bg-gradient-to-br from-amber-50 to-orange-50">
                    <BookOpen className="size-10 text-amber-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
                    {typeof guide.view_count === "number" && (
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {guide.view_count.toLocaleString()}
                      </span>
                    )}
                    {guide.reg_dt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatTimestampDot(guide.reg_dt)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </Container>
  )
}

function GuideDetail({
  guide,
  onBack,
}: {
  guide: BoardItem
  onBack: () => void
}) {
  const heroImage = guide.image_urls?.[0]
  const galleryImages = guide.image_urls ?? []

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        가이드 목록
      </button>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {/* Hero image */}
        {heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={heroImage}
              alt={guide.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">
            {guide.title}
          </h2>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {typeof guide.view_count === "number" && (
              <span className="flex items-center gap-1.5">
                <Eye className="size-4" />
                조회 {guide.view_count.toLocaleString()}
              </span>
            )}
            {guide.reg_dt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {formatTimestampDot(guide.reg_dt)}
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="my-5 border-border" />

          {/* Image gallery */}
          {galleryImages.length > 0 && (
            <div className="space-y-4">
              {galleryImages.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative w-full rounded-xl overflow-hidden bg-muted"
                >
                  <Image
                    src={url}
                    alt={`${guide.title} 이미지 ${idx + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA button */}
          {guide.link?.btn_name && (
            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  // link.target can be used for in-app navigation
                  // For now, just a visual button
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {guide.link.btn_name}
                <ExternalLink className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
