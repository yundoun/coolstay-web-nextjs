import { Skeleton } from "@/components/ui/skeleton"
import { Section } from "@/components/layout"
import { RegionCardSkeleton, MagazineCardSkeleton } from "@/components/skeleton"

/**
 * 홈페이지 스켈레톤
 * 실제 page.tsx 구조와 1:1 대응:
 * 검색바 → 업태카테고리 → 배너 → 프로모카드 → 추천숙소 → 기획전 → 이벤트 → 매거진
 */
export function HomePageSkeleton() {
  return (
    <main className="bg-white">
      {/* 검색바 — CompactSearchBar: rounded-full border bg-muted/60 */}
      <div className="section-px pt-4 pb-2 max-w-[var(--container-narrow)] mx-auto">
        <Skeleton className="h-11 rounded-full" />
      </div>

      {/* 1. 업태 카테고리 — BusinessTypeGrid: grid-cols-4 */}
      <Section spacing="md">
        <div className="grid grid-cols-4 gap-y-3 gap-x-2 section-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-1">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="mt-1.5 h-3 w-10" />
            </div>
          ))}
        </div>
      </Section>

      {/* 2. 배너 캐러셀 — PromoBannerCarousel: aspect-[5/2] rounded-xl */}
      <Section spacing="sm">
        <div className="section-px">
          <Skeleton className="aspect-[5/2] rounded-xl" />
        </div>
      </Section>

      {/* 3. 프로모 카드 — PromoCards: grid-cols-3, 아이콘+텍스트 */}
      <Section spacing="md">
        <div className="grid grid-cols-3 gap-2 section-px">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl py-3 px-2 bg-muted/40"
            >
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </Section>

      {/* 5. 추천 숙소 — RegionRecommendations: 타이틀 + 탭 + 카드그리드 */}
      <Section spacing="lg">
        {/* 타이틀 행 */}
        <div className="flex items-center justify-between section-px mb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        {/* 탭 바 */}
        <div className="section-px mb-4">
          <div className="flex items-center gap-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-2.5">
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 section-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <RegionCardSkeleton key={i} />
          ))}
        </div>
      </Section>

      {/* 6. 기획전 — FeatureSection: 세로 카드 리스트, h-[200px] */}
      <Section spacing="lg">
        <div className="mb-3 flex items-end justify-between gap-4 section-px">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col gap-3 section-px">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      </Section>

      {/* 7. 이벤트 — EventSection: featured aspect-[2.5/1] */}
      <Section spacing="lg">
        <div className="mb-3 flex items-end justify-between gap-4 section-px">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="section-px">
          <Skeleton className="aspect-[2.5/1] rounded-xl" />
        </div>
      </Section>

      {/* 8. 매거진 — MagazineSection: 가로 스크롤, w-[200px] aspect-[3/4] */}
      <Section spacing="lg">
        <div className="mb-3 flex items-end justify-between gap-4 section-px">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-3 section-px overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <MagazineCardSkeleton key={i} />
          ))}
        </div>
      </Section>
    </main>
  )
}
