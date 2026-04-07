# 검색 자동완성 + 인기검색어 실데이터 API 연동

> 작업일: 2026-04-07

## 변경 사항

### 1. 인기검색어 API 연동
- `GET /manage/popular/keyword` API 연동 (기존 csApi.ts의 `getPopularKeywords` 활용)
- `usePopularKeywords` 훅 추가 (5분 캐시)
- CompactSearchBar, PopularKeywords 컴포넌트에서 CMS 관리 데이터 표시

### 2. 자동완성 API 연동 (압축 해제 포함)
- `GET /contents/total/keywordList?isCompress=true` — 서버가 비압축 응답 미지원 (500 에러)
- `src/lib/api/decompress.ts` 신규 생성: CompressedResult 압축 해제 유틸
  - Base64 디코드 → ZIP 파싱 → DecompressionStream('deflate-raw') → JSON
- `keyword_lists` (3,242건) + `search_results` (2,422건) 활용

### 3. AOS 패턴 기준 3섹션 자동완성
- 검색어 (K): keyword_lists 필터링, 최대 3개 (🔍 아이콘)
- 지역/지하철 (R/S): search_results 필터링, 최대 5개 (📍/🚇 아이콘)
- 숙소 (M): search_results 필터링, 최대 5개 (🏢 아이콘), 클릭 시 숙소 상세 이동

### 4. mock 데이터 의존 제거
- `src/domains/search/data/autocomplete.ts`의 mock 데이터 import 전부 제거
- CompactSearchBar, PopularKeywords, KeywordSearchSection 모두 API 데이터로 전환

### 5. API 명세서 업데이트
- `docs/api/contents-search.md`: keywordList 압축 응답 문서화, 인기검색어 API 섹션 추가, 자동완성 흐름도 추가

## 파일 변경

| 파일 | 변경 |
|------|------|
| `src/lib/api/decompress.ts` | 신규 — ZIP 압축 해제 유틸 |
| `src/lib/api/types.ts` | CompressedResult, SearchResultItem 타입 추가 |
| `src/domains/search/api/keywordApi.ts` | 압축 응답 수신 + 해제 처리 |
| `src/domains/search/hooks/useKeywordData.ts` | usePopularKeywords 훅 추가 |
| `src/domains/search/components/CompactSearchBar.tsx` | 3섹션 자동완성 + 인기검색어 API |
| `src/domains/search/components/PopularKeywords.tsx` | 인기검색어 API 연동 |
| `src/domains/search/components/KeywordSearchSection.tsx` | keywordList API 연동 |
| `docs/api/contents-search.md` | 명세서 업데이트 |
