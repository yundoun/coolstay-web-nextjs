# P9-2: React Query 전환 — notification/notice/faq/inquiry

## 작업 내용
- 4개 컴포넌트 내 useState+useEffect → useQuery 전환
- notification: optimistic update(읽음 처리) + invalidateQueries(삭제)
- inquiry: LoadingSpinner/EmptyState 공통 컴포넌트 적용

## 변경 파일
- `src/domains/notification/components/NotificationPage.tsx`
- `src/domains/notice/components/NoticeListPage.tsx`
- `src/domains/faq/components/FaqPage.tsx`
- `src/domains/inquiry/components/InquiryPage.tsx`
