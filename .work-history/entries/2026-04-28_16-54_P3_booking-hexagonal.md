# P3: 파일럿 도메인 전환 (booking)

## 변경 사항

### 포트
- `src/domains/booking/ports/BookingRepository.ts` — 예약 데이터 접근 포트 (9개 메서드)
- `src/domains/booking/ports/PaymentGateway.ts` — 결제 게이트웨이 포트

### 어댑터
- `src/domains/booking/adapters/ApiBookingRepository.ts` — HttpClient 주입, BookingRepository 구현

### 서비스
- `src/domains/booking/services/BookingService.ts` — 순수 비즈니스 로직
  - calculateCouponDiscount: CC009 제약 포함 쿠폰 할인 계산
  - calculatePayment: 결제 금액 계산
  - findBestCouponId: 최적 쿠폰 선택
  - validateBookerInfo: 예약자 정보 검증

### 리팩토링
- `useBookingForm.ts` — 인라인 비즈니스 로직을 BookingService 함수로 교체
- `di/types.ts` — Container에 bookingRepository 추가
- `di/container.ts` — ApiBookingRepository 등록

## 테스트
- BookingService: 13 cases
- ApiBookingRepository: 7 cases
- 전체 108/109 통과 (1개 기존 실패)
