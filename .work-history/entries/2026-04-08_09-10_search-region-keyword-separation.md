# 검색 UI 지역/키워드 완전 분리

## 배경
- 지역 모달에서 "부산 전체" 선택 시 키워드 검색으로 fallback → 사용자 의도와 다른 결과
- API 테스트: 상위 코드(ALL_XX)는 total_count:-1 반환 (검색 미실행)
- 키워드 "부산"은 숙소명 기반 검색으로 지역 검색과 완전히 다른 결과
- 조건 바에 키워드 뱃지 + 지역 버튼 동시 표시 → 혼란

## 변경 내용
- 지역 모달(PC/모바일): "도시 전체" 옵션 제거, 하위 지역 선택 강제
- 헤더 검색바: URL keyword를 input에 반영하여 검색어 유지
- 조건 바: 키워드 검색 시 지역 버튼 숨김
- searchParams: 키워드 fallback 분기 제거
- isTopLevelCode 판별 로직 제거

## 수정 파일
- `src/components/search/SearchModal.tsx`
- `src/domains/search/components/CompactSearchBar.tsx`
- `src/domains/search/components/SearchConditionBar.tsx`
- `src/domains/search/components/SearchPageLayout.tsx`
- `src/domains/search/utils/searchParams.ts`
