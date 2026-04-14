# 라우트별 헤더/네비게이션 레이아웃 시스템 및 스크롤 초기화

## 작업 내용

### 라우트별 레이아웃 설정 시스템
- `route-layout-config.ts` 생성: 라우트 경로에 따라 headerVariant(default/back/minimal), showBottomNav, title, rightActions 결정
- 정확 매치(EXACT_ROUTES) + 패턴 매치(PATTERN_ROUTES) 2단계 라우트 매칭

### Header 3가지 variant
- **default**: 로고 + 검색바 + 네비게이션 (홈, 검색, 목록 페이지)
- **back**: ← 뒤로가기 + 타이틀 + 우측 액션 (상세, 서브, 인증 페이지)
- **minimal**: 홈 버튼만 (예약완료, 결제완료)

### BottomNav 조건부 렌더링
- 상세/플로우/인증 페이지에서 하단 네비 숨김
- 목록/탐색/지원 페이지에서는 유지

### MainContent 패딩 동적 조정
- 헤더 variant에 따른 상단 패딩 조정 (compact: 56px, default: 64px)
- BottomNav 숨김 시 하단 패딩 제거

### 스크롤 초기화
- `ScrollToTop` 컴포넌트: pathname 변경 시 스크롤 최상단 초기화
- popstate(뒤로가기/앞으로가기)는 브라우저 기본 스크롤 복원 유지

## 변경 파일
- `src/components/layout/route-layout-config.ts` (신규)
- `src/components/layout/ScrollToTop.tsx` (신규)
- `src/components/layout/Header/Header.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/MainContent.tsx`
- `src/components/layout/index.ts`
- `src/app/layout.tsx`
