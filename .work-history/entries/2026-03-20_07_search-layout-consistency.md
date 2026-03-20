# 검색 페이지 레이아웃 통일

- **날짜**: 2026-03-20
- **작업 유형**: refactor
- **영향 범위**: src/domains/search/components/SearchPageLayout.tsx, PopularKeywords.tsx

## 변경 사항
- `/search`와 `/search?region=seoul` 레이아웃 통일
- 인기 키워드를 조건부 표시 → 항상 표시 (접이식 아코디언)
- PopularKeywords를 컴팩트 토글 바로 변경 (접힌 상태에서 인기 키워드 미리보기 표시)
- 두 URL 모두 동일한 섹션 순서: 조건바 → 인기키워드(접이식) → 결과바 → 그리드
