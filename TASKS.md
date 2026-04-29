# Phase 3 — 주요 페이지 스켈레톤 적용

> **진행률**: 5 / 5 (100%)

### 핵심 페이지 스켈레톤
- [x] `HT-1` 홈페이지 스켈레톤 추출
  - 인라인 → `src/domains/home/components/HomePageSkeleton.tsx`
  - `src/app/(public)/loading.tsx` 생성

- [x] `HT-2` 숙소 상세 페이지 스켈레톤
  - `src/domains/accommodation/components/AccommodationDetailSkeleton.tsx`
  - LoadingSpinner → AccommodationDetailSkeleton 교체
  - `src/app/(public)/accommodations/[id]/loading.tsx` 생성

- [x] `HT-3` 검색 결과 페이지 스켈레톤
  - `src/domains/search/components/SearchPageSkeleton.tsx`
  - Suspense fallback "로딩 중..." → SearchPageSkeleton 교체
  - `src/app/(public)/search/loading.tsx` 생성

- [x] `HT-4` 예약 내역 페이지 스켈레톤
  - `src/domains/booking/components/BookingHistoryPageSkeleton.tsx`
  - BookingListSkeleton (인라인) + BookingHistoryPageSkeleton (loading.tsx)
  - `src/app/(protected)/bookings/loading.tsx` 생성

### 매거진 리팩토링
- [x] `HT-5` 매거진 인라인 스켈레톤 프리미티브 적용
  - MagazineSection: MagazineCardSkeleton 사용
  - BoardListPage: BoardCardSkeleton + GridSkeleton 사용
  - PackageListPage: PackageCardSkeleton + GridSkeleton 사용
