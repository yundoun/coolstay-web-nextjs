# 스켈레톤 일관성 수정 + 나머지 페이지 적용

> **진행률**: 9 / 10 (90%)

## 원칙
- 콘텐츠 로딩 → 스켈레톤 (레이아웃 예측 가능)
- 액션 로딩 → 스피너 (버튼 클릭, 폼 제출, 결제)
- 모든 스켈레톤은 `<Skeleton>` 프리미티브 사용 (`bg-accent animate-pulse`)
- 수동 `bg-neutral-100 animate-pulse` 금지
- 각 태스크 완료 후 dev 서버에서 실제 확인

---

### 일관성 수정 (기존 작업 누락분)

- [x] `FIX-1` RegionRecommendations 인라인 스켈레톤 → RegionCardSkeleton 교체
- [x] `FIX-2` HomePageSkeleton 실제 홈 레이아웃과 1:1 동기화
- [x] `FIX-3` FavoritesPage Loader2 → WishlistCardSkeleton 교체
- [x] `FIX-4` SearchPageLayout 내부 LoadingSpinner → AccommodationCardSkeleton 교체

---

### 나머지 페이지 스켈레톤 적용

- [x] `RR-1` 이벤트 목록/상세 스켈레톤 + loading.tsx 2개
- [x] `RR-2` 기획전 목록/상세 스켈레톤 + loading.tsx 2개
- [x] `RR-3` 쿠폰/마일리지 스켈레톤 + loading.tsx 2개
- [x] `RR-4` 리뷰/알림/문의 스켈레톤 + loading.tsx 4개
- [x] `RR-5` 예약상세/설정/정보 페이지 스켈레톤 + loading.tsx 6개

---

### 최종 검증

- [ ] `RR-6` 전체 빌드 + 일관성 최종 점검
