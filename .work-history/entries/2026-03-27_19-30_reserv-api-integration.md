# 예약 API 연동 + 명세서 작성

## 작업 내용

### 예약 API 레이어 구축
- `src/domains/booking/api/reservationApi.ts` 생성 — API 함수 8개
- `src/lib/api/types.ts`에 예약 응답 타입 추가 (BookItem, UserPaymentInfo 등)
- API→웹 타입 변환 유틸 작성 (toBookingHistoryItem, toBookingDetail)

### 예약 생성 플로우 (ready API)
- useBookingSubmit 훅 — ready API 호출로 예약 생성
- 숙소 상세 API에서 패키지 키, 시간 정보(STIME/ETIME/UTIME) 추출
- 현장결제(SITE) 지원 (PG SDK 미연동으로 온라인 결제는 준비중)

### 예약 목록/상세 연동
- BookingHistoryPage → useBookingList (users/list API + cursor 페이징)
- BookingDetailPage → useBookingDetail (ST102 조회 + 취소/삭제)
- 4탭 필터: 전체/예약/이용완료/취소

### 연동 중 발견한 사항 (명세서 반영)
- item_key는 패키지(sub_item) 키여야 함 (객실 키 아님)
- item_type: "010101"(대실) / "010102"(숙박) — "RENT"/"STAY" 불가
- payment_pg: "IAMPORT" 불가, 실제 PG코드 필요 (INICIS, TOSS_PAYMENTS)
- 체크인/아웃 시간은 daily_extras의 STIME/ETIME/UTIME 기반

## 변경 파일
- docs/api/reservation.md (신규)
- src/domains/booking/api/reservationApi.ts (신규)
- src/domains/booking/hooks/useBookingSubmit.ts (신규)
- src/domains/booking/hooks/useBookingList.ts (신규)
- src/domains/booking/hooks/useBookingDetail.ts (신규)
- src/domains/booking/components/BookingPageClient.tsx (신규)
- 기존 컴포넌트/타입 12개 수정
