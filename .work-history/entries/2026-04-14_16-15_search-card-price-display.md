# 검색 카드 대실/숙박 가격 구분 표시 및 쿠폰 실결제가 표시

## 변경 사항

### 신규 파일
- `src/lib/utils/coupon.ts` — 쿠폰 할인 계산 공통 유틸 (calcCouponDiscount, calcBestCouponPrice)

### 수정 파일
- `src/components/accommodation/AccommodationCard.tsx`
  - Accommodation 인터페이스에 대실/숙박 별도 가격 + 쿠폰 적용가 필드 추가
  - PriceRow 컴포넌트 신규 — 타입별 행 레이아웃 (라벨+할인율+정가+할인가+쿠폰+실결제가)
  - 대실/숙박 중 없는 타입은 행 미표시 (공간 낭비 제거)
  - 실결제가를 text-lg font-extrabold로 최대 강조, 쿠폰 영역 bg-rose-50 배경

- `src/domains/search/utils/mapStoreToAccommodation.ts`
  - 대실/숙박 별도 가격 매핑 추가
  - sub_item 레벨 쿠폰 우선, store 레벨 쿠폰 폴백으로 쿠폰 적용가 계산
  - 쿠폰 라벨 (무제한/선착순/한정/특가) 자동 추출

- `src/domains/accommodation/components/RoomCard.tsx`
  - 로컬 calcCouponDiscount 제거 → 공통 유틸 import으로 교체

## 디자인 원칙
- 실결제가 > 할인가 > 할인율+정가 순 시각적 위계
- 쿠폰 있을 때 할인가는 취소선 처리 → 중간 가격임을 명확히
- 행 기반 레이아웃으로 타입별 독립 표시 (없는 타입 = 행 없음)
