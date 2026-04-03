# fix: 키워드/지역 검색 빈 결과 반환 버그 수정

## 문제
- 내주변/헤더 텍스트 검색은 정상 동작하지만, 키워드 칩 선택이나 지역 선택 시 빈 결과 반환
- AOS 앱·백엔드 코드와 비교 분석하여 3가지 원인 확인

## 원인 분석

### 1. 키워드 칩 클릭 시 regionCode 잔존
- KeywordSearchSection이 기존 URL params를 유지하면서 keyword만 추가
- 이전 지역 검색의 regionCode가 남아있으면 keywordParams가 undefined → 키워드 검색 안 됨

### 2. 상위 지역코드(ALL_XX) 서버 미지원
- dev 서버 검증: `ALL_01`(서울 전체) → `total_count: -1` (검색 미실행)
- `ALL_0100001`(강남/역삼) → `total_count: 196` (정상)
- 서버가 하위 지역코드만 처리하는데 웹은 상위 코드도 그대로 전송

### 3. keyword/regionCode 동시 설정으로 검색 로직 충돌
- handleRegionChange가 keyword=지역명, regionCode=코드 동시 설정
- 키워드 검색과 지역 검색의 URL params가 혼재

## 수정 내용
- `KeywordSearchSection.tsx`: 키워드 칩 클릭 시 `regionCode` 제거
- `SearchConditionBar.tsx`: `ALL_XX` 형태 상위 코드 감지 → 키워드 검색 fallback
- `SearchPageLayout.tsx`: keyword/regionCode 상호 배타 관리, `regionName` 표시용 분리
- `docs/api/contents-search.md`: 지역코드 체계, total_count 의미, 분기 로직 문서화

## 검증
- Playwright MCP로 dev 서버 실제 API 응답 확인
- 하위지역(강남) 196개, 도시전체(서울→키워드 fallback) 105개, 키워드칩(수영장) 75개 정상 반환
