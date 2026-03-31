# P8-5: 검색 결과 페이지 무한 스크롤 / 필터 UX

## 작업 내용
- SearchPageLayout에 IntersectionObserver 기반 무한 스크롤 구현
- 12개씩 점진적 로드, 스크롤 시 자동 추가
- 공통 LoadingSpinner/EmptyState 적용
- 검색 결과 변경 시 visibleCount 자동 리셋

## 변경 파일
- `src/domains/search/components/SearchPageLayout.tsx`
