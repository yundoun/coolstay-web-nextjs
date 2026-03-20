# 홈 화면 모바일 앱 기반 개편

- **날짜**: 2026-03-20
- **작업 유형**: refactor, feature
- **영향 범위**: src/domains/home/, src/app/page.tsx

## 변경 사항

### 제거 (모바일에 없음)
- **BentoGrid** (이번 주 추천 큐레이션) — 삭제
- **RegionCarousel** (인기 여행지 캐러셀) — 삭제
- **FeaturedSection** (MD 추천 숙소 그리드) — 삭제
- HeroSection의 Quick Tags (#오션뷰, #커플추천 등) — 삭제

### 추가 (모바일 기능 웹 적용)
- **PromoBannerCarousel** — 모바일의 eventBanners 캐러셀
  - 3초 자동 스크롤 (모바일 앱과 동일)
  - 좌우 화살표 + 도트 인디케이터
  - 프로모션 이미지 + 타이틀 + 딥링크
- **CategoryFilters** — 모바일의 카테고리 필터 (평점순/낮은가격/마일리지/인기순)
  - 선택 시 /search?sort= 로 이동
- **MotelCardList** — 모바일의 searchedMotels 카드 리스트
  - 대실/숙박 가격 분리 표시 (Clock/Moon 아이콘)
  - 마일리지 적립률 버블 (이미지 좌상단)
  - 이벤트 제목 표시 (Tag 아이콘)
  - 평점 + 리뷰 수 (5개 미만이면 숨김, 모바일과 동일)

### HeroSection 간소화
- 높이 축소 (70-80vh → 50-60vh)
- Quick Tags 제거
- 검색바만 남김

### mock 데이터 개편
- CurationItem, Region 타입 삭제
- EventBannerItem, CategoryFilter, HomeMotel 타입 추가
- 모바일 API 응답 구조(HomeMain)에 맞춘 데이터

## 기술적 결정
- 모바일 홈은 사실상 검색 결과 페이지이나, 웹에서는 Hero + 프로모션 배너 + 숙소 리스트로 웹 랜딩 경험 유지
- 카테고리 필터는 별도 상태 관리 없이 /search로 네비게이션하여 검색 페이지와 연동
