import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * AccommodationCard 스켈레톤
 * 대응: src/components/accommodation/AccommodationCard.tsx
 * 이미지(2:1) + 대실/숙박 2열 가격 + 하단 플래그 바
 */
export function AccommodationCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white", className)}>
      {/* 이미지 영역 2:1 */}
      <Skeleton className="aspect-[2/1] rounded-md" />
      {/* 가격 2열 */}
      <div className="grid grid-cols-2 gap-0 px-1.5 pt-2 pb-3 min-h-[103px]">
        <div className="px-1.5 space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="px-1.5 space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      {/* 하단 플래그 바 */}
      <div className="mx-1.5 mb-2">
        <Skeleton className="h-[30px] rounded" />
      </div>
      <div className="h-px bg-border" />
    </div>
  )
}

/**
 * RegionRecommendations 카드 스켈레톤
 * 대응: src/domains/home/components/RegionRecommendations.tsx
 * 이미지(4:3) + 쿠폰 배지 + 숙소명 + 하트/가격
 */
export function RegionCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl overflow-hidden", className)}>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  )
}

/**
 * 찜 목록 카드 스켈레톤
 * 대응: src/domains/favorites/components/FavoritesPage.tsx WishlistCard
 * 이미지(4:3) + 숙소명 + 위치 + 평점/마일리지/쿠폰 행 + 좋아요/가격
 */
export function WishlistCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-2 mt-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

/**
 * 이벤트 카드 스켈레톤
 * 대응: src/domains/event/components/EventListPage.tsx
 * 이미지(16:10) + 상태 배지 + 제목 + 날짜
 */
export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl overflow-hidden border bg-card", className)}>
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * 매거진 게시글 카드 스켈레톤
 * 대응: src/domains/magazine/components/BoardListPage.tsx BoardCard
 * 이미지(16:10) + 제목 + 부제
 */
export function BoardCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl overflow-hidden border bg-card", className)}>
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

/**
 * 매거진 패키지 카드 스켈레톤
 * 대응: src/domains/magazine/components/PackageListPage.tsx PackageCard
 * 이미지(2:1) + 제목 + 설명 + 날짜 + 태그
 */
export function PackageCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl overflow-hidden border bg-card", className)}>
      <Skeleton className="aspect-[2/1] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * 매거진 섹션 카드 스켈레톤 (홈페이지 매거진 캐러셀용)
 * 대응: src/domains/home/components/MagazineSection.tsx
 * 세로형(3:4), 200px 고정 너비
 */
export function MagazineCardSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("w-[200px] aspect-[3/4] rounded-xl shrink-0", className)} />
  )
}
