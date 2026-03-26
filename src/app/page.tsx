"use client"

import { Section } from "@/components/layout"
import {
  HeroSection,
  BusinessTypeGrid,
  PromoBannerCarousel,
  PromoCards,
  RecentlyViewed,
  FeatureSection,
  RegionRecommendations,
  MagazineSection,
} from "@/domains/home/components"
import { useHomeMain } from "@/domains/home/hooks/useHomeData"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { data, isLoading } = useHomeMain()

  if (isLoading) {
    return <HomePageSkeleton />
  }

  return (
    <main>
      {/* 1. Hero - 검색바 */}
      <HeroSection phrase={data?.phrase} />

      {/* 2. 업태 카테고리 */}
      <Section spacing="md">
        <BusinessTypeGrid categories={data?.new_item_categories} />
      </Section>

      {/* 3. 이벤트 배너 캐러셀 */}
      <Section spacing="sm">
        <PromoBannerCarousel banners={data?.banners} />
      </Section>

      {/* 4. 프로모션 버튼 (무제한 / 첫예약 등) */}
      <Section spacing="md">
        <PromoCards buttons={data?.item_buttons} />
      </Section>

      {/* 5. 최근 본 숙소 */}
      {data?.recent_stores && data.recent_stores.length > 0 && (
        <Section title="최근 본 숙소" spacing="md">
          <RecentlyViewed stores={data.recent_stores} />
        </Section>
      )}

      {/* 6. 기획전 */}
      {data?.exhibitions && data.exhibitions.length > 0 && (
        <Section
          title="기획전"
          description="꿀스테이가 엄선한 테마별 숙소 모음"
          spacing="lg"
          background="muted"
        >
          <FeatureSection exhibitions={data.exhibitions} />
        </Section>
      )}

      {/* 7. 이런 숙소는 어떠세요? (지역별 탭 + 그리드) */}
      <Section
        title="이런 숙소는 어떠세요?"
        description="지역별 인기 숙소를 둘러보세요"
        spacing="lg"
      >
        <RegionRecommendations
          categories={data?.recommend_categories}
          stores={data?.recommend_stores}
        />
      </Section>

      {/* 8. 매거진 */}
      {data?.ai_magazines && data.ai_magazines.length > 0 && (
        <Section
          title="매거진"
          description="여행이 더 즐거워지는 이야기"
          spacing="lg"
          background="muted"
        >
          <MagazineSection magazines={data.ai_magazines} />
        </Section>
      )}
    </main>
  )
}

function HomePageSkeleton() {
  return (
    <main>
      {/* Hero skeleton */}
      <Skeleton className="h-[180px] md:h-[220px] w-full" />
      <div className="px-4 mt-6 space-y-6">
        {/* Category grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        {/* Banner */}
        <Skeleton className="h-32 rounded-xl" />
        {/* Promo cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        {/* Region recommendations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  )
}
