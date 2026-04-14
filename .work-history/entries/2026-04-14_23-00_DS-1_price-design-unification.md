# RoomCard 가격/쿠폰 디자인 통일 및 브랜드 컬러 적용

## 작업 내용

### RoomCard 가격 영역 리디자인
- 인라인 가격 표시 + CouponList → PriceBox 컴포넌트로 통합
- 할인율(%) 표시 추가 (originalPrice vs price 계산)
- 쿠폰 존재 시 할인가에 취소선 + 회색 처리
- 정가 취소선에 "원" 누락 수정
- 실결제가를 text-lg font-extrabold text-foreground로 강조

### 브랜드 컬러 통일 (Search + Detail 양쪽)
- rose-500 → primary-700 (#A37F00, 진한 골드)
- bg-rose-50 → bg-primary/10
- 찜 하트 아이콘(rose-400)은 유지

## 변경 파일
- `src/components/accommodation/AccommodationCard.tsx` — PriceRow 색상 변경
- `src/domains/accommodation/components/RoomCard.tsx` — PriceBox 컴포넌트 신규, CouponList 제거
