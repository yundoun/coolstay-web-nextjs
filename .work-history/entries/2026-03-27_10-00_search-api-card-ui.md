# 검색 API 연동 + 카드 UI 개선

## 작업 내용

### 검색 API 연동
- 키워드 검색: 2단계 API 연동 (`search/keyword` → `keyword/list`, ST701)
- 지역 검색: 2단계 API 연동 (`filter` → `filter/list`)
- AOS 앱과 동일한 파라미터 적용 (날짜 `yyyyMMdd`, `sort=BENEFIT`, 빈 문자열 `latitude/longitude`)
- API client에서 빈 문자열 파라미터 필터링 제거

### 카드 UI 개선
- `rating`/`reviewCount` 제거 (StoreItem에 없는 데이터)
- `likeCount`(찜 수), `isLiked`(찜 여부), `priceLabel`(숙박/대실) 추가
- `mapStoreToAccommodation`: 올바른 필드 매핑, 태그에 제휴/연박 포함

## 원인 분석 (검색 API 미동작)
1. 엔드포인트가 달랐음: `contents/list` → `search/keyword` + `keyword/list` (2단계)
2. `sort=BENEFIT` 필수 파라미터 누락
3. 날짜 포맷 불일치: `YYYY-MM-DD` → `yyyyMMdd`

## 수정 파일
- `src/components/accommodation/AccommodationCard.tsx`
- `src/domains/search/components/SearchPageLayout.tsx`
- `src/domains/search/hooks/useContentsData.ts`
- `src/domains/search/hooks/useKeywordData.ts`
- `src/domains/search/utils/mapStoreToAccommodation.ts`
- `src/domains/search/data/mock.ts`
- `src/domains/search/types/index.ts`
- `src/domains/search/api/keywordApi.ts`
- `src/domains/search/components/SearchInfoBar.tsx`
- `src/lib/api/client.ts`
