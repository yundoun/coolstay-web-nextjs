## FIX: 전체 Image 빈 src 에러 일괄 수정 (7개 파일)

### 수정 파일
1. **RoomDetailModal.tsx** — images 배열 필터링 + 0개일 때 placeholder
2. **ReviewSection.tsx** — review.images 빈 문자열 필터링
3. **RoomSummaryCard.tsx** — imageUrl falsy 체크 + placeholder
4. **FavoritesPage.tsx** — `|| ""` → `|| null`
5. **PromoBannerCarousel.tsx** — 조건부 렌더링
6. **FeatureSection.tsx** — `|| ""` 제거 → 조건부 렌더링 + gradient fallback
7. **MyReviewsPage.tsx** — motel thumbnail/review images 빈 URL 필터링
