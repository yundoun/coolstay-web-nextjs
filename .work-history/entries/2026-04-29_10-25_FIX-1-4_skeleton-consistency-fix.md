# FIX-1~FIX-4: 스켈레톤 일관성 수정

## 문제
Phase 3에서 스켈레톤 프리미티브를 만들었지만 기존 인라인 코드 교체를 누락.
bg-neutral-100 수동 animate-pulse, 날것의 Loader2, LoadingSpinner 등 불일치 존재.

## 수정 내용

### FIX-1: RegionRecommendations
- bg-neutral-100 + 수동 animate-pulse 6줄 → RegionCardSkeleton 1줄로 교체

### FIX-2: HomePageSkeleton 
- 실제 page.tsx Section 구조(spacing, title, section-px)와 1:1 대응하도록 재작성

### FIX-3: FavoritesPage
- Loader2 아이콘 직접 사용 → WishlistCardSkeleton 4개 그리드로 교체

### FIX-4: SearchPageLayout
- 메인 콘텐츠 로딩 LoadingSpinner → AccommodationCardSkeleton 4개로 교체
- 무한스크롤 하단 스피너(line 353)는 유지 (페이지네이션 피드백)
