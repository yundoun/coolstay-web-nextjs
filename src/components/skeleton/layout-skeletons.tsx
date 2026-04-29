import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * 섹션 헤더 스켈레톤
 * Section 컴포넌트의 헤더 (제목 + 우측 액션 링크) 패턴
 */
export function SectionHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/**
 * 그리드 스켈레톤
 * N열 그리드에 children을 반복 배치
 */
interface GridSkeletonProps {
  cols?: 1 | 2 | 3 | 4
  rows?: number
  gap?: 2 | 3 | 4
  children: React.ReactNode
  className?: string
}

const COLS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
} as const

const GAP_CLASS = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
} as const

export function GridSkeleton({
  cols = 2,
  rows = 4,
  gap = 3,
  children,
  className,
}: GridSkeletonProps) {
  return (
    <div className={cn("grid", COLS_CLASS[cols], GAP_CLASS[gap], className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  )
}

/**
 * 목록 행 스켈레톤
 * 예약 목록, 알림, 공지 등 리스트 아이템 패턴
 * 좌측 아이콘/이미지 + 우측 텍스트 2~3줄
 */
interface ListItemSkeletonProps {
  lines?: 2 | 3
  hasImage?: boolean
  className?: string
}

export function ListItemSkeleton({
  lines = 2,
  hasImage = false,
  className,
}: ListItemSkeletonProps) {
  return (
    <div className={cn("flex items-start gap-3 py-4 border-b last:border-0", className)}>
      {hasImage ? (
        <Skeleton className="size-16 rounded-lg shrink-0" />
      ) : (
        <Skeleton className="size-10 rounded-full shrink-0" />
      )}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        {lines === 3 && <Skeleton className="h-3 w-1/2" />}
      </div>
    </div>
  )
}

/**
 * 상세 페이지 히어로 스켈레톤
 * 이미지 캐러셀 영역 + 제목 + 메타 정보 행
 */
interface DetailHeroSkeletonProps {
  imageAspect?: string
  className?: string
}

export function DetailHeroSkeleton({
  imageAspect = "aspect-[2/1]",
  className,
}: DetailHeroSkeletonProps) {
  return (
    <div className={cn(className)}>
      {/* 이미지 영역 */}
      <Skeleton className={cn("w-full rounded-none", imageAspect)} />
      {/* 제목 + 메타 */}
      <div className="px-4 py-4 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
