# 남은 Contents 검색 API 연동 [CA-6~8]

## 작업 내용
- CA-6 (total/list): API 함수/Hook 이미 작성 완료, dev 서버 데이터 없음
- CA-7 (filter + filter/list): API 함수/Hook 이미 작성 완료, dev 서버 데이터 없음
- CA-8 (myArea/list): SearchPageLayout에서 지역 미선택 시 내 주변 추천 숙소 API 연동
  - 서울(37.5665, 126.9780) 기본 좌표로 20개 숙소 표시
  - StoreItem → Accommodation 변환 정상 작동 확인

## 변경 파일
- src/domains/search/components/SearchPageLayout.tsx
