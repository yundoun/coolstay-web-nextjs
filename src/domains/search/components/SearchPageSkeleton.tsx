import { Skeleton } from "@/components/ui/skeleton"
import { AccommodationCardSkeleton } from "@/components/skeleton"

/**
 * 검색 결과 페이지 스켈레톤
 * 검색바 + 필터 바 + 정렬 + 숙소 카드 목록
 */
export function SearchPageSkeleton() {
  return (
    <div className="max-w-[var(--container-narrow)] mx-auto">
      {/* 검색 조건 바 */}
      <div className="px-4 py-3 border-b space-y-3">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* 결과 정보 + 정렬 */}
      <div className="px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* 숙소 카드 목록 */}
      <div className="px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AccommodationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
