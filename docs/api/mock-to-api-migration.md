# Mock → API 전환 결과 명세서

> **Phase 5 작업 결과**
> **작성일**: 2026-03-31

---

## 전환 완료

| 도메인 | 컴포넌트 | 전환 방식 | API |
|--------|----------|----------|-----|
| coupon | CouponListPage | useCouponList hook | `GET /benefit/coupons/list` |
| event | EventListPage | useEventList hook | `GET /manage/event/list` |
| settings | SettingsPage | useSettings hook | `GET/POST /auth/users/settings` |
| terms | TermsPage | useTerms hook | `GET /manage/terms/list` (iframe URL) |
| review | MyReviewsPage | useMyReviews hook | `GET /contents/reviews/list` |
| mileage | MileagePage | useMileageDetail hook | `GET /benefit/users/mileage/list` |
| notification | NotificationPage | alarmApi 직접 호출 | `GET /auth/alarms/users/list` |
| inquiry | InquiryPage | csApi 직접 호출 | `GET/POST /manage/board (INQUIRY)` |
| notice | NoticeListPage | csApi 직접 호출 | `GET /manage/board (NOTICE)` |
| faq | FaqPage | csApi 직접 호출 | `GET /manage/board (FAQ)` |

## 보류

| 도메인 | 사유 |
|--------|------|
| favorites | V2에 찜 목록 조회 API 없음 (V1 `GET /users/motels`만 존재) |
| friend | 페이지 라우트 미존재, API 함수만 준비 |
| guide | 서버에 API 없음, 정적 콘텐츠 유지 |

## 제한사항

| 도메인 | 제한 | 비고 |
|--------|------|------|
| mileage | 숙소 목록 API 없음 | store_key별 상세 조회만 가능, 목록은 마이페이지 API 연동 필요 |
| terms | 약관 내용이 URL 기반 | iframe으로 표시, CORS 이슈 발생 가능 |
| review | API 응답 snake_case 확인 필요 | totalCount vs total_count 매핑 검증 대기 |

## 테스트 현황

- 단위 테스트: **77개 전부 통과**
- E2E 검증: Phase 5 완료 후 별도 진행 예정

## 생성된 Hook 목록

| Hook | 파일 | 사용 API |
|------|------|---------|
| useCouponList | `src/domains/coupon/hooks/useCouponList.ts` | couponApi |
| useEventList | `src/domains/event/hooks/useEventList.ts` | eventApi |
| useSettings | `src/domains/settings/hooks/useSettings.ts` | settingsApi |
| useTerms | `src/domains/terms/hooks/useTerms.ts` | termsApi |
| useMyReviews | `src/domains/review/hooks/useMyReviews.ts` | reviewApi |
| useMileageDetail | `src/domains/mileage/hooks/useMileage.ts` | mileageApi |
