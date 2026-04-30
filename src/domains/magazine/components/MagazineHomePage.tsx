"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Section } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { useMagazineHome } from "../hooks/useMagazine"
import { MagazineBannerCarousel } from "./MagazineBannerCarousel"
import { TourSection } from "./TourSection"
import { InfluencerSection } from "./InfluencerSection"
import { RecommendStoreSection } from "./RecommendStoreSection"
import { BoardCardGrid } from "./BoardCardGrid"
import { RegionFilter } from "./RegionFilter"

export function MagazineHomePage() {
  const [regionFilter, setRegionFilter] = useState<{
    provinceCode?: string
    districtCode?: string
  }>({})

  const { data, isLoading, isError, refetch } = useMagazineHome(
    regionFilter.provinceCode,
    regionFilter.districtCode
  )

  function handleRegionSelect(provinceCode?: string, districtCode?: string) {
    setRegionFilter({ provinceCode, districtCode })
  }

  if (isLoading) return <MagazineHomeSkeleton />

  if (isError) {
    return (
      <ErrorState
        message="서버에 연결할 수 없습니다"
        onRetry={() => refetch()}
        fullPage
      />
    )
  }

  return (
    <main className="space-y-10">
      {/* 1. 헤더 */}
      <Section spacing="md">
        <h1 className="text-2xl font-bold">꿀스테이 여행 매거진</h1>
      </Section>

      {/* 2. 배너 캐러셀 */}
      {data?.magazine_banner && data.magazine_banner.length > 0 && (
        <Section spacing="none">
          <MagazineBannerCarousel banners={data.magazine_banner} />
        </Section>
      )}

      {/* 3. 지역 필터 */}
      <Section spacing="none">
        <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
          <span>지금은</span>
          <RegionFilter onSelect={handleRegionSelect} />
        </div>
      </Section>

      {/* 4. AI 추천 관광정보 */}
      <Section
        title="AI 추천 관광정보"
        spacing="md"
        headerAction={<MoreLink href="/magazine/tour" />}
      >
        <TourSection
          areaCode={regionFilter.provinceCode ? Number(regionFilter.provinceCode) : undefined}
          sigunguCode={regionFilter.districtCode ? Number(regionFilter.districtCode) : undefined}
        />
      </Section>

      {/* 5. 인플루언서 영상 */}
      {data?.magazine_video && data.magazine_video.length > 0 && (
        <Section
          title="인플루언서와 함께 여행"
          spacing="md"
        >
          <InfluencerSection videos={data.magazine_video} />
        </Section>
      )}

      {/* 6. 추천 숙소 모아보기 */}
      <Section
        title="추천 숙소 모아보기"
        spacing="md"
        headerAction={<MoreLink href="/search" />}
      >
        <RecommendStoreSection />
      </Section>

      {/* 7. 이런 글은 어떠신지 */}
      {data?.magazine_board && data.magazine_board.length > 0 && (
        <Section
          title="이런 글은 어떠신지"
          spacing="md"
          headerAction={<MoreLink href="/magazine/board" />}
        >
          <BoardCardGrid boards={data.magazine_board} hideMore />
        </Section>
      )}
    </main>
  )
}

function MoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      전체보기
      <ChevronRight className="size-3.5" />
    </Link>
  )
}

function MagazineHomeSkeleton() {
  return (
    <main className="space-y-10">
      <Section spacing="md">
        <Skeleton className="h-8 w-52" />
      </Section>
      <Section spacing="none">
        <Skeleton className="aspect-video w-full rounded-xl" />
      </Section>
      <Section spacing="none">
        <Skeleton className="h-9 w-32 rounded-full mx-4" />
      </Section>
      <Section spacing="md">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex gap-2 px-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-full" />
          ))}
        </div>
        <div className="flex gap-3 px-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-[174px] h-[200px] rounded-xl shrink-0" />
          ))}
        </div>
      </Section>
      <Section spacing="md">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex gap-3 px-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="w-[322px] aspect-video rounded-2xl shrink-0" />
          ))}
        </div>
      </Section>
    </main>
  )
}
