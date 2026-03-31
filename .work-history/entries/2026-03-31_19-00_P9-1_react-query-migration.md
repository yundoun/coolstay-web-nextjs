# P9-1: React Query 전환 — coupon/event/settings/terms/review/mileage

## 작업 내용
- 6개 훅 useState+useEffect → useQuery 전환
- settings: optimistic update + rollback 유지 (queryClient.setQueryData)
- coupon: invalidateQueries로 목록 갱신
- review: invalidateQueries로 목록 갱신
- 테스트 QueryClientProvider wrapper 추가

## 변경 파일
- `src/domains/coupon/hooks/useCouponList.ts`
- `src/domains/coupon/hooks/__tests__/useCouponList.test.ts`
- `src/domains/event/hooks/useEventList.ts`
- `src/domains/settings/hooks/useSettings.ts`
- `src/domains/terms/hooks/useTerms.ts`
- `src/domains/review/hooks/useMyReviews.ts`
- `src/domains/mileage/hooks/useMileage.ts`
