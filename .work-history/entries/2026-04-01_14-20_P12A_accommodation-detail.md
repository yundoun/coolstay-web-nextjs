# Phase 12-A — 숙소 상세 API 필드 100% 활용

## 타입/매핑 확장 (15개 필드 추가)
- AccommodationDetail에 coupons, benefits, downloadCouponInfo, paymentBenefit, extraServices, sitePaymentYn, consecutiveYn, coolConsecutivePopup, v2SupportFlag, v2ExternalLinks, externalEvents, likeCount, userLikeYn, businessInfo, nearbyDescription, locationDescription 추가
- mapMotelToDetail에서 전체 매핑 (events 하드코딩 제거, directDiscountYn 쿠폰 기반)

## 신규 컴포넌트 5개
- BenefitSection: 혜택 뱃지 + 쿠폰 다운로드 + 연박/마일리지/v2SupportFlag
- ExtraServiceSection: 부가 서비스 그리드 + 현장결제 뱃지
- BusinessInfoSection: 사업자 정보 (접이식) + 전화 버튼
- ExternalLinkSection: 외부 링크 버튼 목록
- ParkingInfoCard: 주차 정보 카드

## 레이아웃 통합
- AccommodationDetailLayout에 4개 섹션 삽입
  - AmenityList 뒤: BenefitSection + ExtraServiceSection
  - PolicySection 뒤: ExternalLinkSection + BusinessInfoSection
