# P9-3, P9-5: snake_case 통일 + mock 전환

## P9-3: API 응답 snake_case 통일
- ContentsListResponse: totalCount→total_count, nextCursor→next_cursor 등
- ReviewListResponse: totalCount→total_count, nextCursor→next_cursor
- MyReviewsPage 참조 코드 수정

## P9-5: mock 사용 컴포넌트 전환
- search/data/mock.ts → sortOptions를 constants.ts로 분리
- SearchPageLayout: mock fallback 제거, API 결과 없으면 빈 배열
- AccommodationDetailPage: mock fallback 제거, API 전용
- accommodation/data/mock.ts, search/data/mock.ts 삭제
- guide/favorites: API 미존재로 정적 데이터 유지

## 변경 파일
- `src/lib/api/types.ts`
- `src/domains/review/components/MyReviewsPage.tsx`
- `src/domains/search/data/constants.ts` (신규)
- `src/domains/search/components/SearchInfoBar.tsx`
- `src/domains/search/components/SearchPageLayout.tsx`
- `src/domains/accommodation/components/AccommodationDetailPage.tsx`
