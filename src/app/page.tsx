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

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero - 검색바 */}
      <HeroSection />

      {/* 2. 업태 카테고리 */}
      <Section spacing="md">
        <BusinessTypeGrid />
      </Section>

      {/* 3. 이벤트 배너 캐러셀 */}
      <Section spacing="sm">
        <PromoBannerCarousel />
      </Section>

      {/* 4. 프로모션 3종 (무제한 혜택 / 국내 최저가 / 첫예약 선물) */}
      <Section spacing="md">
        <PromoCards />
      </Section>

      {/* 5. 최근 본 숙소 */}
      <Section
        title="최근 본 숙소"
        spacing="md"
      >
        <RecentlyViewed />
      </Section>

      {/* 6. 기획전 */}
      <Section
        title="기획전"
        description="꿀스테이가 엄선한 테마별 숙소 모음"
        spacing="lg"
        background="muted"
      >
        <FeatureSection />
      </Section>

      {/* 7. 이런 숙소는 어떠세요? (지역별 탭 + 그리드) */}
      <Section
        title="이런 숙소는 어떠세요?"
        description="지역별 인기 숙소를 둘러보세요"
        spacing="lg"
      >
        <RegionRecommendations />
      </Section>

      {/* 8. 매거진 */}
      <Section
        title="매거진"
        description="여행이 더 즐거워지는 이야기"
        spacing="lg"
        background="muted"
      >
        <MagazineSection />
      </Section>
    </main>
  )
}
