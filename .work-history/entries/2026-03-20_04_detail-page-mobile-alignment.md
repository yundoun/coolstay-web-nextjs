# 상세 페이지 모바일 앱 기능 정합 (7개 항목)

- **날짜**: 2026-03-20
- **작업 유형**: feature, refactor
- **영향 범위**: src/domains/accommodation/

## 변경 사항

### 1. 대실/숙박 구분 (RoomCard)
- Room 타입에 rentalPrice/rentalTime/rentalAvailable, stayPrice/stayAvailable 분리
- RoomCard에 대실(Clock 아이콘)/숙박(Moon 아이콘) 두 가격 영역 표시
- 각각 별도 예약 버튼 (type=rental / type=stay 쿼리 파라미터)
- 대실 미제공 객실은 숙박만 표시

### 2. 마일리지 적립률 (AccommodationInfo + BookingWidget + MobileBar)
- AccommodationDetail에 benefitPointRate 필드 추가
- 숙소명 아래 "+N% 적립" Coins 아이콘과 함께 표시
- 예약 위젯/모바일 하단바에도 적립률 표시

### 3. 쿠폰 섹션 (AccommodationInfo)
- directDiscountYn 필드 기반 쿠폰 버튼 영역 표시
- "직접할인 쿠폰" + "내 쿠폰" 두 버튼 (Ticket 아이콘)

### 4. 전화 걸기 (MobileBookingBar + BookingWidget)
- phoneNumber 필드 추가 (safeNumber 매핑)
- 모바일 하단바: 좌측 전화 아이콘 버튼 (tel: 링크)
- 데스크톱 위젯: "전화 문의" 텍스트 버튼

### 5. 베스트 리뷰 하이라이트 (ReviewSection)
- bestReview 필드 분리 (bestReviews 배열 → bestReview 단일 + recentReviews 배열)
- Award 아이콘 + "베스트 리뷰" 라벨로 별도 하이라이트
- primary 색상 보더로 시각적 구분

### 6. 뱃지 제거 (AccommodationInfo)
- badges 필드 제거 (AccommodationDetail 타입에서 삭제)
- AccommodationInfo에서 badge 렌더링 코드 삭제
- tags만 유지 (모바일 앱의 keywords에 해당)

### 7. 사장님 인사말 (AccommodationInfo)
- greetingMsg 필드 추가
- primary 색상 배경 카드로 표시 (빈 값이면 숨김)

## 기술적 결정
- Room 타입을 대실/숙박 분리 구조로 변경하여 모바일 API의 subItems(T000001/T000002) 구조와 매핑 가능
- 최저가 표시: BookingWidget에서 stayAvailable인 객실 중 최저 stayPrice 자동 계산
