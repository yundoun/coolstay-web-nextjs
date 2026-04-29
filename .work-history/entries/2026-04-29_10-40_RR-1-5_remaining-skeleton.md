# RR-1~RR-5: 나머지 전체 페이지 스켈레톤 적용

## 변경 사항

### RR-1: 이벤트 목록/상세
- EventListPage: LoadingSpinner → EventCardSkeleton 그리드 + 필터탭 스켈레톤
- EventDetailPage: LoadingSpinner → DetailHeroSkeleton + 본문 스켈레톤
- loading.tsx: events/, events/[id]/

### RR-2: 기획전 목록/상세
- ExhibitionListPage: LoadingSpinner → EventCardSkeleton 그리드
- ExhibitionDetailPage: LoadingSpinner → DetailHeroSkeleton
- PackageExhibitionPage: LoadingSpinner → PackageCardSkeleton 그리드
- loading.tsx: exhibitions/, exhibitions/[id]/

### RR-3: 쿠폰/마일리지
- CouponListPage: LoadingSpinner → ListItemSkeleton
- MileageStoreList: LoadingSpinner → ListItemSkeleton
- loading.tsx: coupons/, mileage/

### RR-4: 리뷰/알림/문의
- MyReviewsPage: LoadingSpinner → ListItemSkeleton (이미지)
- NotificationPage: LoadingSpinner → ListItemSkeleton
- InquiryPage: LoadingSpinner → ListItemSkeleton
- AccommodationReviewsPage: LoadingSpinner fullPage → 리뷰 요약 + ListItemSkeleton
- loading.tsx: reviews/, notifications/, inquiries/, favorites/

### RR-5: 예약상세/설정/정보
- BookingDetailPage: LoadingSpinner fullPage → 예약 상세 스켈레톤
- SettingsPage: LoadingSpinner → ListItemSkeleton
- TermsPage: LoadingSpinner → 탭 + iframe 스켈레톤
- GuidePage: LoadingSpinner → ListItemSkeleton (이미지)
- NoticeListPage: LoadingSpinner → ListItemSkeleton
- FaqPage: LoadingSpinner → ListItemSkeleton
- loading.tsx: bookings/[id]/, settings/, terms/, guide/, notices/, faq/
