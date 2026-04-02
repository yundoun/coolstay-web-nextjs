# 예약 페이지 쿠폰 적용 기능 연동

## 변경 내역

### BookingPageClient.tsx
- 예약 페이지 진입 시 `getCouponList()` API 호출 추가
- 파라미터: search_type(ST601), item_category_code, book_dt, discount_price
- CC004(적용 제휴점), CC001(최소 객실 금액) 기반 클라이언트 필터링
- API 쿠폰 → 예약 UI용 Coupon 타입 변환 (mapApiCouponToBooking)

### booking/types/index.ts
- BookingContext에 rawCoupons 필드 추가 (원본 API 쿠폰 데이터 보존)

### useBookingSubmit.ts
- 예약 제출 시 rawCoupons에서 원본 데이터 참조하여 ReservReadyCouponItem 구성
- 기존 플레이스홀더 값 → 실제 code, constraints, day_codes 등 전달
