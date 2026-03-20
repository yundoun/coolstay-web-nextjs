# 예약 내역 페이지 구현

## 작업 내용
- /bookings 페이지 구현 (모바일 앱 BookingListActivity 기반)
- 2탭 구조: 전체(5) / 예약(2) — 입실전 예약만 필터
- 카드형 리스트: 객실 이미지 + 상태 뱃지(예약완료/이용완료/예약취소) + 숙소/객실명 + 날짜 + 금액
- 상태별 액션 버튼: 예약 취소, 숙소 보기, 후기 작성/확인
- 대실/숙박 구분 뱃지, N박 M일 표시
- 빈 상태 UI (숙소 둘러보기 CTA)

## 변경 파일
- src/domains/booking/types/index.ts — BookingStatus, BookingHistoryItem 타입 추가
- src/domains/booking/data/mock.ts — 예약 내역 목데이터 5건
- src/domains/booking/components/BookingHistoryPage.tsx — 예약 내역 페이지 컴포넌트
- src/domains/booking/components/index.ts — export 추가
- src/app/bookings/page.tsx — 페이지 라우트
