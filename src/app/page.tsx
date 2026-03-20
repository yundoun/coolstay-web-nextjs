import { Section, Container } from "@/components/layout"
import {
  HeroSection,
  PromoBannerCarousel,
  CategoryFilters,
  MotelCardList,
} from "@/domains/home/components"

export default function HomePage() {
  return (
    <main>
      {/* Hero - 검색바 */}
      <HeroSection />

      {/* 이벤트 배너 캐러셀 */}
      <Section spacing="md">
        <PromoBannerCarousel />
      </Section>

      {/* 카테고리 필터 + 숙소 리스트 */}
      <Section spacing="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            주변 숙소
          </h2>
          <CategoryFilters />
        </div>
        <MotelCardList />
      </Section>
    </main>
  )
}
