# DS-1~DS-4: 디자인 시스템 페이지 개편

## 변경 사항

### DS-1: App Router 이전 + 파일 분할
- `src/pages/design-system.tsx` (766줄 단일 파일) → 삭제
- `src/app/(public)/design-system/page.tsx` + 9개 탭 컴포넌트 생성
- `src/pages/_app.tsx`, `_document.tsx` 제거
- Pretendard 폰트 CDN, favicon, theme-color를 root layout으로 이전

### DS-2: 컬러 탭 CSS 변수 참조
- 하드코딩 hex 값 → `getComputedStyle`로 CSS 변수 실제값 동적 표시
- Theme Tokens 섹션 추가

### DS-3: 누락 컴포넌트 추가
- FeedbackTab: LoadingSpinner, EmptyState, ErrorState
- OverlayTab: Sheet (Right/Bottom)
- DataDisplayTab: DropdownMenu

### DS-4: Loading 탭 신설
- 사용 원칙 (스켈레톤 vs 스피너)
- Phase 1 카드/레이아웃 스켈레톤 전체 데모
- pulse/shimmer variant 비교
