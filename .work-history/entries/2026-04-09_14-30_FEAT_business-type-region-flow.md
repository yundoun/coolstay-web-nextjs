# feat: 업태 클릭 → 지역 선택 → 검색 플로우 구현

## 변경 사항

### BusinessTypeGrid 플로우 변경
- Link → button 전환, 클릭 시 지역 선택 모달 오픈
- mapping_business_types 전체를 콤마 구분으로 전달 (AOS 앱 동일)
- A_MR_07(쿠폰함), A_CP_01 → /coupons 네비게이션 매핑

### SearchModal 지역 선택 로직
- 업태별 region category 코드로 지역 조회 (MOTEL → MOTEL_xxxxx)
- 유효하지 않은 category (HANOK, RESORT 등) → 유효값(GUESTHOUSE 등)으로 fallback
- 하위 지역 없는 카테고리는 도시 자체를 바로 선택 가능
- 지역 선택 후 /search?type=XXX&regionCode=YYY&regionName=ZZZ로 네비게이션

### API 파라미터 수정
- filter/keyword API: adultCount→adultCnt, kidsCount→kidCnt (스펙 일치)

## 수정 파일
- src/lib/stores/search-modal.ts
- src/domains/home/components/BusinessTypeGrid.tsx
- src/components/search/SearchModal.tsx
- src/domains/search/api/contentsApi.ts
- src/domains/search/api/keywordApi.ts
- src/domains/search/components/SearchPageLayout.tsx
- src/domains/search/hooks/useContentsData.ts
- src/domains/search/hooks/useKeywordData.ts

## 테스트
- src/lib/stores/__tests__/search-modal.test.ts (5 cases)
- E2E: 모텔 → 서울/강남 → 19건 검색 결과 확인
