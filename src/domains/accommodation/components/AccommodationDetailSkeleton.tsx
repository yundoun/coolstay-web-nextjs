import { Skeleton } from "@/components/ui/skeleton"
import { AccommodationCardSkeleton } from "@/components/skeleton"

/**
 * 숙소 상세 페이지 스켈레톤
 * 대응: AccommodationDetailLayout.tsx
 * 이미지 갤러리 + 숙소 정보 + 날짜/인원 바 + 객실 목록 + 리뷰
 */
export function AccommodationDetailSkeleton() {
  return (
    <div className="bg-white">
      {/* 이미지 갤러리 */}
      <Skeleton className="aspect-[4/3] sm:aspect-[2/1] w-full rounded-none" />

      <div className="max-w-[var(--container-narrow)] mx-auto px-4">
        {/* 숙소명 + 평점 */}
        <div className="py-4 space-y-3">
          <Skeleton className="h-7 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* 날짜/인원 선택 바 */}
        <div className="flex gap-2 py-3 border-y">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 py-3 border-b">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16" />
          ))}
        </div>

        {/* 리뷰 요약 */}
        <div className="py-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* 객실 목록 */}
        <div className="py-6 space-y-4 border-t">
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-3">
              <Skeleton className="aspect-[2/1] rounded-lg" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex justify-between items-end">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
