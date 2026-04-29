# SK-1~SK-4: 스켈레톤 프리미티브 라이브러리 구축

## 변경 사항

### SK-1: Skeleton 기본 컴포넌트 shimmer variant 추가
- `src/components/ui/skeleton.tsx`: `variant` prop 추가 (`pulse` | `shimmer`)
- globals.css의 기존 `@keyframes shimmer` 활용
- 기본값 `pulse`로 하위호환 유지

### SK-2: 카드 스켈레톤 7종
- `src/components/skeleton/card-skeletons.tsx`
- AccommodationCardSkeleton, RegionCardSkeleton, WishlistCardSkeleton,
  EventCardSkeleton, BoardCardSkeleton, PackageCardSkeleton, MagazineCardSkeleton

### SK-3: 레이아웃 스켈레톤 4종
- `src/components/skeleton/layout-skeletons.tsx`
- SectionHeaderSkeleton, GridSkeleton, ListItemSkeleton, DetailHeroSkeleton

### SK-4: barrel export
- `src/components/skeleton/index.ts`

## 테스트
- skeleton.test.tsx: 5 cases
- card-skeletons.test.tsx: 24 cases
- layout-skeletons.test.tsx: 14 cases
- 총 43 cases 전체 통과
