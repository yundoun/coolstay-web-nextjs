# 하단 고정 요소 z-index 통일 및 예약 완료 후 뒤로가기 방지

## 변경 사항

### 1. Footer pb-16 조건부 적용
- `Footer.tsx`: `pb-16`이 모든 페이지에 무조건 적용되던 레거시 코드 수정
- `showBottomNav: true`인 페이지에서만 `pb-16` 적용

### 2. z-index 통일 (z-40 → z-[var(--z-fixed)])
- `BookingPageLayout.tsx`: 모바일 결제 바 z-40 → z-[var(--z-fixed)] (1030)
- `AccommodationDetailLayout.tsx`: 서브 네비 z-40 → z-[var(--z-fixed)] (1030)

### 3. 예약 완료 후 뒤로가기 방지
- `useBookingSubmit.ts`: 예약하기→완료 이동 시 `router.push` → `router.replace`
- `BookingCompletePage.tsx`: 완료→예약내역/홈 이동 시 `Link(push)` → `router.replace`
- 히스토리 스택에서 예약 페이지와 완료 페이지가 모두 제거됨

### 4. safe-area-bottom CSS 정의
- `globals.css`: `env(safe-area-inset-bottom)` 사용하는 클래스 추가
- BottomNav, BookingPageLayout 하단 바에서 iPhone 홈 인디케이터 대응

## 수정 파일
- `src/components/layout/Footer.tsx`
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx`
- `src/domains/booking/components/BookingCompletePage.tsx`
- `src/domains/booking/components/BookingPageLayout.tsx`
- `src/domains/booking/hooks/useBookingSubmit.ts`
- `src/styles/globals.css`
