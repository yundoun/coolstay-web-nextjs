# 검색 모달 + 히어로/헤더 pill 스크롤 동기화

- **날짜**: 2026-03-20
- **작업 유형**: feature
- **영향 범위**: src/components/search/SearchModal.tsx (신규), src/lib/stores/search-modal.ts (신규), src/domains/home/components/HeroSection.tsx, src/components/layout/Header/, src/app/layout.tsx

## 변경 사항

### 1. IntersectionObserver 기반 스크롤 동기화
- 고정 threshold(300px) → IntersectionObserver로 교체
- 히어로 검색바(`#hero-search-bar`)를 감시하여 뷰포트에서 사라지는 **정확한 순간** pill 등장
- rootMargin `-64px` (헤더 높이)으로 헤더 뒤에 숨기 직전 전환
- 히어로 검색바와 헤더 pill이 겹치는 구간 0

### 2. 검색 모달 (SearchModal)
- zustand store로 전역 상태 관리 (useSearchModal)
- 히어로 검색바 클릭 → 모달 오픈
- 헤더 pill 클릭 → 모달 오픈
- 3-step 플로우: 여행지 → 날짜 → 인원
  - Step 1 (여행지): 지역 8개 그리드 + 인기 검색어 칩
  - Step 2 (날짜): 체크인/체크아웃 date input
  - Step 3 (인원): 성인/아동 카운터
- 하단: 초기화 + 검색하기 버튼
- ESC 닫기, 백드롭 클릭 닫기, body overflow hidden
- 검색 시 /search?region= 으로 이동

### 3. HeroSection 검색바 변경
- SearchBar 컴포넌트 → 커스텀 button으로 교체 (클릭 시 모달 오픈)
- id="hero-search-bar" 추가 (IntersectionObserver 타겟)

### 4. CompactSearchBar 변경
- Link → button으로 교체 (클릭 시 모달 오픈)

### 5. Root Layout
- SearchModal을 body 하단에 렌더링 (전역 1개 인스턴스)

## 기술적 결정
- IntersectionObserver는 scroll 이벤트보다 성능적으로 우수하고 정확함
- zustand으로 모달 상태를 전역 관리하여 Header/HeroSection 간 결합도 제거
- 모달 step 플로우는 에어비앤비 스타일 참고 — 웹에서 트렌디한 검색 UX
