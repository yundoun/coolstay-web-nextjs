# Contents API 타입/함수/Hook 기반 작성 [CA-1~3]

## 작업 내용
- types.ts: Contents API 응답 타입 정의 (RegionsResponse, ContentsListResponse, FilterResponse, MyAreaResponse 등)
- StoreItem에 distance, partnership_type 필드 추가
- contentsApi.ts: 6개 API 함수 (getRegions, getContentsList, getTotalList, getFilterKeys, getFilterList, getMyAreaList)
- useContentsData.ts: React Query hooks (useRegions, useContentsList, useTotalList, useFilterKeys, useMyAreaList)
- SearchPageLayout: API 연동 초안 (regionCode 파라미터 기반 검색, mock 폴백)
- mapStoreToAccommodation 유틸: StoreItem → AccommodationCard 변환

## 변경 파일
- src/lib/api/types.ts
- src/domains/search/api/contentsApi.ts (new)
- src/domains/search/hooks/useContentsData.ts (new)
- src/domains/search/components/SearchPageLayout.tsx
- src/domains/search/utils/mapStoreToAccommodation.ts (new)
