# 숙소 상세 날짜/인원 선택 → 재조회 및 객실 필터링

## 작업 내용
- 숙소 상세 페이지에서 SearchModal의 날짜/인원 적용 시 API 재조회 + 인원 초과 객실 필터링
- Room 타입에 maxAdults/maxKids 추가, daily_extras에서 MAX_ADULT/MAX_KIDS 추출
- search-modal store에 onApply 콜백 패턴 도입 (close 시 호출, unmount 시 해제)
- 모바일 하단바에 인원 변경 버튼 추가
- 더미 가격 시뮬레이션(dateSeed) 제거 → 실제 API search_start/search_end 파라미터 사용

## 변경 파일
- src/domains/accommodation/types/index.ts — Room에 maxAdults, maxKids 필드 추가
- src/domains/accommodation/utils/mapMotelToDetail.ts — MAX_ADULT/MAX_KIDS extras 추출
- src/domains/accommodation/components/AccommodationDetailPage.tsx — dates state로 API 재호출
- src/domains/accommodation/components/AccommodationDetailLayout.tsx — 인원 필터링, 빈 상태 UI
- src/lib/stores/search-modal.ts — onApply 콜백 + setOnApply 액션 추가
