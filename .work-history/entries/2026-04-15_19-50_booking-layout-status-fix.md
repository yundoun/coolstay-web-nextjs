# 예약 페이지 레이아웃/상태매핑/네비게이션 수정

## 변경 사항

### 레이아웃 수정
- 예약 상세 페이지 Container `size="normal"(1200px)` → `size="narrow"(800px)` 통일
- 예약 상세 페이지 내 중��� 헤더(뒤로가기+타이틀) 제거 (글로벌 Header에서 표시)

### 헤더 홈 아이콘 추가
- `/bookings` 예약내역 헤더에 `rightActions: ["home"]` 추가
- `/bookings/[id]` 예약 상세 헤더에 `rightActions: ["home"]` 추가

### 뒤로가기 오류 수정
- 예약 완료 페이지 이동: `router.push` → `router.replace`로 변경
- BookingCompletePage: 데이터 없이 접근 시 `/bookings`로 리다이렉트

### API 상태 코드 매핑 수정
- `mapStatus`에 BS 코드 매핑 추가 (BS001~BS005)
- BS001/BS002/BS004 → confirmed, BS003 → cancelled, BS005 → checked_in
- 이전: 모든 예약이 "처리중"��로 표시되던 버그 수정

### 미동작 버튼 제거
- BookingHistoryPage 카드의 onClick 없는 "예약 취소" 버튼 제거
- 상세 페이지(`/bookings/{id}`)에서 취소 ��능

## 수정 파일
- `src/components/layout/route-layout-config.ts`
- `src/domains/booking/components/BookingDetailPage.tsx`
- `src/domains/booking/components/BookingHistoryPage.tsx`
- `src/domains/booking/components/BookingCompletePage.tsx`
- `src/domains/booking/components/BookingPageLayout.tsx`
- `src/domains/booking/types/index.ts`
