# HT-1~HT-5: 주요 페이지 스켈레톤 적용

## 변경 사항

### 스켈레톤 컴포넌트 생성
- HomePageSkeleton → 홈 페이지 전용
- AccommodationDetailSkeleton → 숙소 상세 전용
- SearchPageSkeleton → 검색 결과 전용
- BookingListSkeleton / BookingHistoryPageSkeleton → 예약 내역 전용

### loading.tsx 파일 생성
- src/app/(public)/loading.tsx
- src/app/(public)/accommodations/[id]/loading.tsx
- src/app/(public)/search/loading.tsx
- src/app/(protected)/bookings/loading.tsx

### 기존 코드 교체
- AccommodationDetailPage: LoadingSpinner → AccommodationDetailSkeleton
- SearchPage: Suspense fallback "로딩 중..." → SearchPageSkeleton
- BookingHistoryPage: LoadingSpinner → BookingListSkeleton
- MagazineSection/BoardListPage/PackageListPage: 인라인 스켈레톤 → 프리미티브 사용

### 빌드 검증
- next build 성공
