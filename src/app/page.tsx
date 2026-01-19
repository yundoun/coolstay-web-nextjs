import { Section } from "@/components/layout"
import {
  HeroSection,
  BentoGrid,
  RegionCarousel,
  FeaturedSection,
} from "@/domains/home/components"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section - Full width, 70-80vh */}
      <HeroSection />

      {/* Curation Bento Grid */}
      <Section title="이번 주 추천" spacing="lg">
        <BentoGrid />
      </Section>

      {/* Popular Regions Carousel */}
      <Section
        title="인기 여행지"
        description="지금 가장 핫한 국내 여행지를 만나보세요"
        background="muted"
        spacing="lg"
      >
        <RegionCarousel />
      </Section>

      {/* Featured Accommodations */}
      <FeaturedSection />
    </main>
  )
}
