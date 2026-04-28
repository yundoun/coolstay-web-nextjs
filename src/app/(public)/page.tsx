"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/layout"
import { CompactSearchBar } from "@/domains/search/components/CompactSearchBar"
import {
  BusinessTypeGrid,
  PromoBannerCarousel,
  PromoCards,
  RecentlyViewed,
  FeatureSection,
  EventSection,
  RegionRecommendations,
  MagazineSection,
} from "@/domains/home/components"
import { useHomeMain } from "@/domains/home/hooks/useHomeData"
import { Skeleton } from "@/components/ui/skeleton"

const SectionLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
  >
    {label}
    <ArrowRight className="size-3" />
  </Link>
)

export default function HomePage() {
  const { data, isLoading } = useHomeMain()

  if (isLoading) {
    return <HomePageSkeleton />
  }

  return (
    <main className="bg-white">
      {/* 검색바 — 스크롤 전에는 콘텐츠에, 스크롤 후에는 헤더로 이동 */}
      <div id="content-search-bar" className="section-px pt-4 pb-2 max-w-[var(--container-narrow)] mx-auto">
        <CompactSearchBar />
      </div>

      {/* 1. 업태 카테고리 */}
      <Section spacing="md">
        <BusinessTypeGrid categories={data?.new_item_categories} />
      </Section>

      {/* 2. 배너 캐러셀 */}
      <Section spacing="sm">
        <PromoBannerCarousel banners={data?.banners} />
      </Section>

      {/* 3. 랜딩 버튼 */}
      <Section spacing="md">
        <PromoCards buttons={data?.item_buttons} />
      </Section>

      {/* 4. 최근 본 숙소 */}
      {data?.recent_stores && data.recent_stores.length > 0 && (
        <Section title="최근 본 숙소" spacing="lg">
          <RecentlyViewed stores={data.recent_stores} />
        </Section>
      )}

      {/* 5. 추천 숙소 */}
      <Section title="이런 숙소는 어떠세요?" spacing="lg">
        <RegionRecommendations
          categories={data?.recommend_categories}
          stores={data?.recommend_stores}
        />
      </Section>

      {/* 6. 기획전 */}
      {data?.exhibitions && data.exhibitions.length > 0 && (
        <Section title="기획전" spacing="lg" headerAction={<SectionLink href="/exhibitions" label="전체보기" />}>
          <FeatureSection exhibitions={data.exhibitions} />
        </Section>
      )}

      {/* 7. 이벤트 */}
      <Section
        title="이벤트"
        spacing="lg"
        headerAction={<SectionLink href="/events" label="전체보기" />}
      >
        <EventSection />
      </Section>

      {/* 8. 매거진 */}
      <Section
        title="꿀스테이 여행 매거진"
        spacing="lg"
        headerAction={<SectionLink href="/magazine" label="매거진 더보기" />}
      >
        <MagazineSection />
      </Section>
    </main>
  )
}

function HomePageSkeleton() {
  return (
    <main className="max-w-[var(--container-narrow)] mx-auto px-4">
      <div className="mt-6 space-y-5">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-14 rounded-full shrink-0" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[85px] flex-1 rounded-xl" />
          ))}
        </div>
        <div className="h-2 bg-neutral-100 -mx-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  )
}
