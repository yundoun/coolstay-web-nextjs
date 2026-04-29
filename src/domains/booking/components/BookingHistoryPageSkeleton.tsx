import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

/**
 * 예약 내역 목록 스켈레톤 (인라인 사용)
 * 예약 카드 3개
 */
export function BookingListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="size-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 예약 내역 전체 페이지 스켈레톤 (loading.tsx 용)
 * 제목 + 탭 + 카드 목록
 */
export function BookingHistoryPageSkeleton() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="flex gap-1 mb-6 border-b pb-px">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-16" />
        ))}
      </div>
      <BookingListSkeleton />
    </Container>
  )
}
