import { Skeleton } from "@/components/ui/skeleton"
import { RegionCardSkeleton, MagazineCardSkeleton } from "@/components/skeleton"

export function HomePageSkeleton() {
  return (
    <main className="bg-white max-w-[var(--container-narrow)] mx-auto">
      <div className="px-4 mt-6 space-y-5">
        {/* 검색바 플레이스홀더 */}
        <Skeleton className="h-11 rounded-full" />

        {/* 업태 카테고리 */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>

        {/* 배너 캐러셀 */}
        <Skeleton className="h-32 rounded-xl" />

        {/* 프로모 카드 3열 */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[85px] flex-1 rounded-xl" />
          ))}
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-neutral-100 -mx-4" />

        {/* 추천 숙소 헤더 + 탭 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* 추천 숙소 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RegionCardSkeleton key={i} />
          ))}
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-neutral-100 -mx-4" />

        {/* 매거진 섹션 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <MagazineCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
