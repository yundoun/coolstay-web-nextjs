# 예약 페이지 구현

## 작업 내용
- 숙소 상세 → 예약 → 예약 완료 전체 플로우 구현
- 모바일 앱 4단계를 웹 2페이지로 압축
  - /booking/[accommodationId]: 예약 정보 입력 (객실 요약, 예약자, 이동수단, 쿠폰/마일리지, 결제수단, 약관)
  - /booking/[accommodationId]/complete: 예약 완료 확인
- 데스크탑: 2/3 폼 + 1/3 결제 요약 사이드바 (sticky)
- 모바일: 하단 고정 결제 바

## 주요 컴포넌트
- BookingPageLayout — 전체 레이아웃 + useBookingForm 훅
- RoomSummaryCard — 선택 객실/숙소 정보
- BookerInfoForm — 예약자 이름/전화번호
- VehicleSelector — 도보/차량 선택 + 주차 안내
- CouponSelector — 쿠폰 목록 + 할인 적용
- MileageInput — 마일리지 사용 (최소 3,000P / 1,000P 단위)
- PaymentMethodSelector — 카드/계좌이체/휴대폰/현장결제
- AgreementCheckboxes — 전체 동의 + 개별 약관
- PaymentSummaryCard — 결제 요약 (sticky sidebar)
- BookingCompletePage — 예약 완료 확인

## 변경 파일
- src/domains/booking/ — types, data/mock, hooks, components (전체 신규)
- src/app/booking/[accommodationId]/page.tsx — 예약 페이지
- src/app/booking/[accommodationId]/complete/page.tsx — 예약 완료 페이지
