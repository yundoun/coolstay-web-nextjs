# P8-1~3: 공통 상태 컴포넌트 통일

## 작업 내용
- LoadingSpinner, ErrorState, EmptyState 공통 컴포넌트 생성
- 10+ 페이지의 인라인 로딩/에러/빈상태 패턴을 공통 컴포넌트로 교체
- 기존 빌드 에러 수정 (api.get 타입, MileagePage 타입, LoginPage null체크)

## 변경 파일
### 신규 컴포넌트
- `src/components/ui/loading-spinner.tsx` — 공통 로딩 스피너
- `src/components/ui/error-state.tsx` — 공통 에러 상태
- `src/components/ui/empty-state.tsx` — 공통 빈 상태

### 테스트
- `src/components/ui/__tests__/loading-spinner.test.tsx` (6 cases)
- `src/components/ui/__tests__/error-state.test.tsx` (5 cases)
- `src/components/ui/__tests__/empty-state.test.tsx` (5 cases)

### 리팩토링된 페이지
- CouponListPage, BookingHistoryPage, MyReviewsPage
- MileagePage, FavoritesPage, EventListPage
- NoticeListPage, NotificationPage, FaqPage
- SettingsPage, TermsPage

## 테스트 결과
- 전체 93 tests passed (21 files)
- TypeScript 컴파일 에러 0개
