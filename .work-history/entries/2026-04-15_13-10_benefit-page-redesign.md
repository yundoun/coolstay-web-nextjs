# 혜택함 페이지 쿠폰/마일리지 탭 구조 재설계

## 작업 내용
AOS 앱 패턴에 맞춰 /coupons 라우트를 쿠폰+마일리지 2탭 구조로 재설계.
마일리지 탭에서 GET /contents/list?search_type=ST004 API로 적립 제휴점 목록 표시.

## 변경 파일
- `src/domains/benefit/` — 신규 도메인 (BenefitPage, MileageStoreList, MileageStoreCard, useMileageStores 훅, 타입)
- `src/app/(protected)/coupons/page.tsx` — CouponListPage → BenefitPage, 메타 "혜택함"
- `src/domains/coupon/components/CouponListPage.tsx` — embedded prop 추가 (탭 내 사용 지원)
- `src/domains/mypage/components/MyPage.tsx` — 마일리지 링크 /coupons?tab=mileage, "P" → "개 제휴점" 표기 수정
- `src/lib/api/types.ts` — StoreItem에 user_point_amount, expire_point_amount 추가

## 검증
- 쿠폰 탭: 기존 6장 정상, 코드 등록 UI 유지
- 마일리지 탭: ST004 API 연동 확인 (도운텔2, 4% 적립, 33,840P)
- ?tab=mileage 직접 진입 정상
- 마이페이지 연동 정상
