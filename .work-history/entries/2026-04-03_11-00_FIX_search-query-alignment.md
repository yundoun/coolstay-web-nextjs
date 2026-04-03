# fix: 검색 API 파라미터 AOS 앱 동작과 정렬

## 변경 사항
- 지역/키워드 검색 시 latitude/longitude를 빈 문자열로 전송 (AOS 동일 동작)
- myArea 중복 호출 방지: useUserLocation의 isLocating 플래그로 위치 확정 후 1회만 호출
- filter/list 2단계 POST에 type 파라미터 추가 (AOS 동일 동작)
- 검색 모달 지하철 탭 추가, 지역 API 카테고리 변경
- CompactSearchBar, SearchConditionBar, SearchInfoBar UI 개선

## 원인 분석
- AOS 앱은 Region/Keyword 검색 시 lat/lng를 빈 문자열로 전송하지만 웹은 실제 좌표를 전송하여 서버가 다른 로직을 타는 문제
- useUserLocation 초기값(서울시청)으로 즉시 API 호출 → Geolocation 확정 후 재호출로 중복 발생
