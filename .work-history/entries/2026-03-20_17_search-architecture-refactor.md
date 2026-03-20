# 검색 자동완성 아키텍처 리팩토링

- **날짜**: 2026-03-20 11:50
- **작업 유형**: refactor
- **영향 범위**: src/domains/search/, src/components/layout/Header/

## 변경 내용

### 파일 분리
- `src/domains/search/data/autocomplete.ts` 신규 — 자동완성 데이터 + 제안 로직 분리
  - AUTOCOMPLETE_KEYWORDS, REGION_SUGGESTIONS, ACCOMMODATION_SUGGESTIONS
  - POPULAR_KEYWORDS (CompactSearchBar + PopularKeywords 공유)
  - suggestKeywords(), suggestRegions(), suggestAccommodations()

### 컴포넌트 이동
- `CompactSearchBar.tsx`: layout/Header/ → domains/search/components/
- 검색 도메인 로직이므로 도메인 디렉토리로 이동

### 데이터 중복 제거
- PopularKeywords.tsx: 하드코딩된 인기검색어 → autocomplete.ts의 POPULAR_KEYWORDS import
- CompactSearchBar: 인라인 데이터 60줄 → autocomplete.ts에서 import

### barrel export 정리
- Header/index.ts: CompactSearchBar export 제거
- layout/index.ts: CompactSearchBar re-export 제거
- search/components/index.ts: CompactSearchBar export 추가
- Header.tsx: import 경로 @/domains/search/components/로 변경
