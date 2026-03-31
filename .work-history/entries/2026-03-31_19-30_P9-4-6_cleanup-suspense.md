# P9-4, P9-6: mock 정리 + Suspense boundary 수정

## 작업 내용
- 미사용 mock 데이터 11개 파일 삭제
- LoginPage Suspense boundary 추가 → 빌드 성공

## 삭제된 mock 파일 (11개)
- coupon, event, faq, inquiry, mileage, notice
- notification, review, settings, home, booking

## 변경 파일
- `src/app/(public)/login/page.tsx` — Suspense 추가
