"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Container } from "@/components/layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { getGuideList } from "@/domains/cs/api/csApi"
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
      <h1 className="text-2xl font-bold mb-6">꿀팁 가이드</h1>

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
        <div className="space-y-3">
          {guides.map((guide) => (
            <button
              key={guide.key}
              onClick={() => setSelectedGuide(guide)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              {guide.banner_image_url ? (
                <div className="relative size-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={guide.banner_image_url}
                    alt={guide.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 shrink-0">
                  <BookOpen className="size-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{guide.title}</h3>
                {guide.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {guide.description}
                  </p>
                )}
              </div>
              <ChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
            </button>
          ))}
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
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        가이드 목록
      </button>

      <div className="rounded-xl border bg-card overflow-hidden">
        {guide.banner_image_url && (
          <div className="relative aspect-[2/1] w-full">
            <Image
              src={guide.banner_image_url}
              alt={guide.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
            />
          </div>
        )}

        <div className="p-5">
          <h2 className="text-lg font-bold">{guide.title}</h2>
          {guide.description && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
              {guide.description}
            </p>
          )}

          {guide.images && guide.images.length > 0 && (
            <div className="mt-4 space-y-3">
              {guide.images.map((img, idx) => (
                <div key={img.url || idx} className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
                  <Image
                    src={img.url}
                    alt={`${guide.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                </div>
              ))}
            </div>
          )}

          {guide.web_view_link && (
            <a
              href={guide.web_view_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary hover:underline"
            >
              자세히 보기
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </Container>
  )
}
