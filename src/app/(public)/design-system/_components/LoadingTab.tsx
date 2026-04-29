"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  AccommodationCardSkeleton,
  RegionCardSkeleton,
  WishlistCardSkeleton,
  EventCardSkeleton,
  BoardCardSkeleton,
  PackageCardSkeleton,
  MagazineCardSkeleton,
  SectionHeaderSkeleton,
  GridSkeleton,
  ListItemSkeleton,
  DetailHeroSkeleton,
} from "@/components/skeleton"

export function LoadingTab() {
  return (
    <div className="space-y-8">
      {/* 사용 원칙 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">사용 원칙</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6 space-y-3">
            <h3 className="font-bold text-lg">Skeleton</h3>
            <p className="text-sm text-muted-foreground">
              콘텐츠가 로딩되는 영역의 레이아웃을 미리 보여줍니다.
              사용자가 &quot;어떤 형태의 콘텐츠가 올지&quot; 예측할 수 있을 때 사용합니다.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>- ���드 목록 (숙소, 이벤트, 매거진)</li>
              <li>- 상세 페이지 (숙소, 예약)</li>
              <li>- 프로필, 리뷰 목록</li>
            </ul>
          </div>
          <div className="rounded-xl border p-6 space-y-3">
            <h3 className="font-bold text-lg">Spinner</h3>
            <p className="text-sm text-muted-foreground">
              결과를 예측할 수 없는 ����의 진행 상태를 표시합니다.
              &quot;작��이 ���행 중&quot;이라는 피드백이 목적일 때 사용합니다.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>- 폼 제출 (예약, 결제)</li>
              <li>- 버튼 클릭 후 처리</li>
              <li>- 인증/로그인 처리</li>
            </ul>
          </div>
        </div>
      </section>

      <Separator />

      {/* 기본 Skeleton */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Base Skeleton</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              variant=&quot;pulse&quot; (기본)
            </h3>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              variant=&quot;shimmer&quot;
            </h3>
            <div className="flex items-center space-x-4">
              <Skeleton variant="shimmer" className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton variant="shimmer" className="h-4 w-[250px]" />
                <Skeleton variant="shimmer" className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 카드 스켈레톤 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Card Skeletons</h2>

        <h3 className="font-semibold mb-3">AccommodationCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">숙소 카드 (이미지 2:1 + 대실/숙박 2열 가격 + 하단 플래그)</p>
        <div className="max-w-sm mb-8">
          <AccommodationCardSkeleton />
        </div>

        <h3 className="font-semibold mb-3">RegionCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">추천 숙소 카드 (이미지 4:3 + 이름 + 가격)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <RegionCardSkeleton key={i} />
          ))}
        </div>

        <h3 className="font-semibold mb-3">WishlistCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">찜 카드 (이미지 4:3 + 평점/마일리지/쿠폰 행)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>

        <h3 className="font-semibold mb-3">EventCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">이벤트 카드 (이미지 16:10 + 제목 + 날짜)</p>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mb-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>

        <h3 className="font-semibold mb-3">BoardCardSkeleton / PackageCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">매거진 게시글 (16:10) / 패키지 (2:1)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mb-8">
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <PackageCardSkeleton />
        </div>

        <h3 className="font-semibold mb-3">MagazineCardSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">매거진 캐러셀용 세로형 (3:4, 200px 고정)</p>
        <div className="flex gap-3 overflow-hidden mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MagazineCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <Separator />

      {/* 레이아웃 스켈레톤 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Layout Skeletons</h2>

        <h3 className="font-semibold mb-3">SectionHeaderSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">섹션 헤더 (제목 + 부제 + 액션 링크)</p>
        <div className="max-w-lg mb-8">
          <SectionHeaderSkeleton />
        </div>

        <h3 className="font-semibold mb-3">GridSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">그리드에 children을 N개 반복 배치</p>
        <div className="mb-8">
          <GridSkeleton cols={4} rows={4} gap={3}>
            <RegionCardSkeleton />
          </GridSkeleton>
        </div>

        <h3 className="font-semibold mb-3">ListItemSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">목록 행 (아이콘/이미지 + 텍스트 2~3줄)</p>
        <div className="max-w-lg mb-8 border rounded-xl px-4">
          <ListItemSkeleton />
          <ListItemSkeleton lines={3} />
          <ListItemSkeleton hasImage />
          <ListItemSkeleton hasImage lines={3} />
        </div>

        <h3 className="font-semibold mb-3">DetailHeroSkeleton</h3>
        <p className="text-sm text-muted-foreground mb-4">상세 페이지 상단 (이미지 + 제목 + 메타)</p>
        <div className="max-w-lg border rounded-xl overflow-hidden">
          <DetailHeroSkeleton />
        </div>
      </section>
    </div>
  )
}
