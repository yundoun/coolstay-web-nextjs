# 인기검색어/최근검색을 헤더 검색바로 이동

## 작업 내용
- 검색 결과 페이지에서 PopularKeywords 섹션 제거 (불필요한 중복)
- 헤더 CompactSearchBar 포커스 시 최근검색 → 인기검색어 순서로 표시
- 최근검색은 localStorage에 저장 (최대 10개)
- 개별 삭제, 전체 삭제 기능 포함

## 변경 파일
- src/domains/search/components/SearchPageLayout.tsx — PopularKeywords 제거
- src/domains/search/components/CompactSearchBar.tsx — 최근검색 기능 추가
