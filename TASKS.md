# Phase 2 — 디자인 시스템 페이지 개편

> **진행률**: 4 / 4 (100%)

### 페이지 이전 + 분할
- [x] `DS-1` App Router 이전 + 9개 탭 컴포넌트 분할
  - Pages Router (`src/pages/design-system.tsx`) → App Router (`src/app/(public)/design-system/`)
  - `_app.tsx`, `_document.tsx` 제거, 폰트/메타를 root layout으로 이전
  - 9개 탭: Colors, Typography, Buttons, Forms, DataDisplay, Feedback, Overlay, Navigation, Loading

### 컬러 동기화
- [x] `DS-2` 컬러 탭 CSS 변수 참조로 변경
  - 하드코딩 hex → `getComputedStyle`로 CSS 변수 실제값 동적 표시
  - Theme Tokens 섹션 추가 (background, foreground, card, muted 등)

### 누락 컴포넌트 추가
- [x] `DS-3` 누락 컴포넌트 7종 추가
  - FeedbackTab: LoadingSpinner (3 sizes), EmptyState, ErrorState
  - OverlayTab: Sheet (Right/Bottom)
  - DataDisplayTab: DropdownMenu

### Loading 탭 신설
- [x] `DS-4` 스켈레톤 가이드라인 + 데모
  - 사용 원칙 (스켈레톤 vs 스피너)
  - Base Skeleton (pulse/shimmer variant 비교)
  - 카드 스켈레톤 7종 데모
  - 레이아웃 스켈레톤 4종 데모
