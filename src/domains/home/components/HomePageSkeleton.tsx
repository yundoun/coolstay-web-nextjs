import { Skeleton } from "@/components/ui/skeleton"
import { Section } from "@/components/layout"
import { RegionCardSkeleton, MagazineCardSkeleton, EventCardSkeleton } from "@/components/skeleton"

/**
 * 홈페이지 스켈레톤
 * 실제 page.tsx 구조와 1:1 대응:
 * 검색바 → 업태카테고리 → 배너 → 프로모카드 → 추천숙소 → 기획전 → 이벤트 → 매거진
 */
export function HomePageSkeleton() {
  return (
    <main className="bg-white">
      {/* 검색바 — page.tsx: section-px pt-4 pb-2 */}
      <div className="section-px pt-4 pb-2 max-w-[var(--container-narrow)] mx-auto">
        <Skeleton className="h-11 rounded-full" />
      </div>

      {/* 1. 업태 카테고리 — Section spacing="md" */}
      <Section spacing="md">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide section-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </Section>

      {/* 2. 배너 캐러셀 — Section spacing="sm" */}
      <Section spacing="sm">
        <div className="section-px">
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </Section>

      {/* 3. 프로모 카드 — Section spacing="md" */}
      <Section spacing="md">
        <div className="flex gap-2 section-px">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[85px] flex-1 rounded-xl" />
          ))}
        </div>
      </Section>

      {/* 5. 추천 숙소 — Section spacing="lg" (title은 내부 컴포넌트) */}
      <Section spacing="lg">
        <div className="section-px mb-3">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="section-px mb-4">
          <div className="flex gap-0 border-b">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 mx-1" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 section-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <RegionCardSkeleton key={i} />
          ))}
        </div>
      </Section>

      {/* 7. 이벤트 — Section spacing="lg" title="이벤트" */}
      <Section spacing="lg">
        <div className="mb-3 flex items-end justify-between gap-4 section-px">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="section-px">
          <Skeleton className="aspect-[2/1] rounded-xl" />
        </div>
      </Section>

      {/* 8. 매거진 — Section spacing="lg" title="꿀스테이 여행 매거진" */}
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
