# 디자인 시스템 점검 및 불일치 수정

- **날짜**: 2026-03-20
- **작업 유형**: refactor
- **영향 범위**: src/domains/home/components/, src/domains/accommodation/components/

## 감사 결과
- 57개 불일치 발견 (High 23, Medium 28, Low 6)
- 19개 컴포넌트 파일에서 발견

## 수정 항목

### 1. border-radius 통일 → `rounded-xl`
- MagazineSection, PromoCards, PromoBannerCarousel, FeatureSection, RoomCard, ReviewSection, BookingWidget: `rounded-2xl` → `rounded-xl`

### 2. hover shadow 통일 → `hover:shadow-lg`
- PromoCards: `hover:shadow-md` → `hover:shadow-lg`
- RecentlyViewed: `hover:shadow-md` → `hover:shadow-lg`

### 3. raw `<button>` → `<Button>` 컴포넌트 교체
- PromoBannerCarousel: 좌/우 화살표, 도트 → Button 컴포넌트
- AccommodationDetailLayout: BookingWidget 날짜/인원 선택, CTA → Button 컴포넌트
- MobileBookingBar: 전화/예약 → Button 컴포넌트

### 4. 하드코딩 색상 → 디자인 토큰
- `text-green-500` → `text-success` (AmenityList)
- `bg-rose-500` → `bg-destructive` (RegionRecommendations)
- `text-rose-500` → `text-destructive` (BookingWidget 할인률)
- `bg-black/30` → `bg-background/30` (PromoBannerCarousel)

### 5. z-index 토큰 사용
- MobileBookingBar: `z-40` → `z-[var(--z-fixed)]`

### 6. 섹션 제목 크기 통일 → `text-xl`
- AccommodationInfo, AmenityList, EventBanner, PolicySection, ReviewSection, AccommodationDetailLayout: `text-lg` → `text-xl`

## 미수정 (의도적 유지)
- HeroSection의 커스텀 높이/패딩: 히어로는 Section 패턴과 다른 레이아웃
- transition duration-500/700: 이미지 호버는 느린 전환이 의도적
- RecentlyViewed의 -mx-4 패딩: edge-to-edge 스크롤이 의도적
