# 검색 API 명세서 동기화

## 작업 내용

검색 API 명세서(`docs/api/contents-search.md`)를 실제 구현(AOS 앱 기반 2단계 API)과 동기화.

### 주요 변경
- `contents/list` 단일 호출 → `search/keyword` + `keyword/list` 2단계 패턴으로 수정
- `filter` + `filter/list` 2단계 웹 사용처 업데이트
- 날짜 포맷 `YYYY-MM-DD` → `yyyyMMdd`, `sort=BENEFIT` 필수 명시
- 1단계/2단계 파라미터명 차이 주의사항 추가
- StoreItem에 카드 매핑 컬럼 추가
- 웹 코드 구조에 `keywordApi.ts`, `useKeywordData.ts` 반영

## 수정 파일
- `docs/api/contents-search.md`
