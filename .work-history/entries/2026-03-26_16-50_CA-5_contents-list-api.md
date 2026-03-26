# 숙소 목록 API 연동 [CA-5]

## 작업 내용
- SearchPageLayout: store의 regionCode를 사용하여 contents/list API 호출
- 지역 선택 → regionCode(API 코드) → contents/list?search_type=ST003 검색
- regionLabels mock 의존 제거, 선택된 지역명 직접 사용
- API 결과 없으면 mock 데이터 폴백 유지

## 변경 파일
- src/domains/search/components/SearchPageLayout.tsx
