# 이니시스 PC 웹표준 결제 UI 플로우 구현

## 작업 내용
- INIStdPay SDK 연동으로 PC 웹표준 결제창 호출
- 결제 수단 선택 UI (카드/계좌이체/휴대폰/현장결제)
- 결제 인증 완료 → returnUrl(public/pg/payment/return.html) → 예약 완료 페이지 이동
- 현장결제: /reserv/ready로 즉시 예약 확정 → 완료 페이지
- PG 결제: 이니시스 인증 UI 플로우만 구현 (실제 PG 승인/register 미연동)
- serve.js에 결제 콜백 핸들러 및 magazine 동적 라우트 추가
- magazine 동적 페이지 generateStaticParams 추가 (정적 빌드 대응)
- dev 서버 배포 스크립트(scripts/deploy-dev.sh) 추가

## 변경 파일
- src/domains/booking/utils/inicis.ts (신규) — 이니시스 폼 데이터 생성, SDK 호출
- src/domains/booking/components/InicisPaymentForm.tsx (신규) — hidden form 컴포넌트
- src/app/(public)/payment/complete/ (신규) — 결제 완료 중간 페이지
- public/pg/payment/return.html, close.html (신규) — 이니시스 returnUrl/closeUrl
- src/domains/booking/hooks/useBookingSubmit.ts — PG 결제 분기 추가
- src/domains/booking/components/BookingPageLayout.tsx — postMessage 리스너, 결제 UI
- src/app/layout.tsx — INIStdPay SDK 스크립트 로드
- serve.js — 결제 콜백, magazine 라우트
- src/lib/api/types.ts — ReservRegisterRequest에 motel_key 추가

## 비고
- 실제 PG 승인은 백엔드의 web-payment 모듈(/external/payments/inicis/result)을 경유해야 하며, 현재 웹에서는 UI 플로우만 구현
- 현장결제(SITE)는 /reserv/ready만으로 즉시 예약 확정되어 정상 동작
