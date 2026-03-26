# 숙소 상세 UI 플로우 개선

## 작업 내용
- BookingWidget: "객실 선택"/"전화 문의" 버튼 제거
- BookingWidget: 날짜/인원 클릭 → SearchModal 바텀시트로 오픈
- MobileBookingBar: 전화/객실선택 제거 → 가격 + "날짜 변경" 버튼만
- RoomCard: 대실 "예약" 클릭 → RentalTimeModal (시간 선택 바텀시트)
- RentalTimeModal 신규: 시간 그리드 → 이용 시간 요약 → 예약 페이지 이동
- SearchModal 날짜 변경 → 상세 페이지 체크인/아웃 반영

## 변경 파일
- src/domains/accommodation/components/AccommodationDetailLayout.tsx
- src/domains/accommodation/components/RoomCard.tsx
- src/domains/accommodation/components/RentalTimeModal.tsx (new)
