# 리뷰 페이지 generateStaticParams 추가

## 작업 내용
- 리뷰 전체보기 페이지에 generateStaticParams 누락으로 BUILD_MODE=export 빌드 실패
- 숙소 상세 페이지와 동일한 패턴으로 추가

## 수정 파일
- src/app/(public)/accommodations/[id]/reviews/page.tsx
