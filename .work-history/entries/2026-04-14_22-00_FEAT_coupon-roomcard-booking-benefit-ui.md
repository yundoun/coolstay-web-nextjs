# 쿠폰 적용 UI + 혜택 섹션 개선

## 작업 내용

### RoomCard 쿠폰 섹션
- 대실/숙박 가격 박스 내 사용 가능 쿠폰 리스트 표시
- 최대 할인 쿠폰 적용 시 실결제금액(쿠폰 적용가) 표시
- 정률(%) 쿠폰 CC009 할인 상한 제약조건 반영

### 예약 페이지 쿠폰 수정
- search_type ST601 → ST602 (예약용 쿠폰 조회)
- search_extra (숙소 키) 파라미터 추가
- book_dt 날짜 포맷 yyyyMMdd → yyyyMMddHHmmss (백엔드 호환)
- 객실 내장 쿠폰(즉시 할인) + 사용자 쿠폰함(ST602) 병합
- couponRes.coupons null 안전 처리
- 최적 쿠폰 자동 적용 (findBestCouponId)

### 혜택 섹션 UI
- 혜택 카드 3개 미리보기 + 더보기/접기 버튼
- 부가 서비스 현장결제 배지 제거 (꿀혜택과 중복)
- 모바일 꿀혜택 구분선 간격 수정
- 부가 서비스 모바일 간격 조정

## 수정 파일
- RoomCard.tsx, BookingPageClient.tsx, useBookingForm.ts
- BenefitSection.tsx, ExtraServiceSection.tsx, AccommodationDetailLayout.tsx
