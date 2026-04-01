# CoolStay Web — 작업 태스크

---

## Phase 6 — 소셜 로그인 `branch: feat/phase6-social-auth` (보류)

> 카카오/네이버 SDK 세팅 + 소셜 로그인/회원가입 연동 (개발자 콘솔 준비 중)

- [ ] `P6-1` 카카오 SDK 세팅 (JavaScript SDK 초기화, 앱 키 설정)
- [ ] `P6-2` 네이버 SDK 세팅 (네이버 로그인 API 초기화)
- [ ] `P6-3` 소셜 로그인 API 연동 — `POST /auth/sessions/users/sns`
- [ ] `P6-4` 소셜 회원가입 API 연동 — `POST /auth/users/sns/register`
- [ ] `P6-5` LoginPage 소셜 버튼 실제 동작 연결
- [ ] `P6-6` RegisterPage 소셜 가입 플로우 연결

---

## Phase 10 — API 응답 구조 재설계 `branch: feat/phase10-api-redesign`

> API 연동 도메인의 타입/컴포넌트를 실제 응답 구조에 맞게 재정비

### 10-A. 이용가이드 재설계

- [x] `P10-1` Legacy 타입 삭제 — `GuideItem`, `GuideStep` (guide/types 디렉토리 삭제)
- [x] `P10-2` GuidePage 에러 상태 보강 — isError 시 ErrorState + 재시도 버튼
  ✅ `src/domains/guide/components/__tests__/GuidePage.test.tsx` (4 cases)
- [x] `P10-3` 가이드 상세 → 목록에서 전달받은 BoardItem 사용 (별도 API 불필요)
- [x] `P10-4` 가이드 테스트 작성
  ✅ `src/domains/guide/components/__tests__/GuidePage.test.tsx` (4 cases)

### 10-B. 쿠폰 재설계

- [x] `P10-5` Legacy 타입 삭제 — `CouponItem`, `CouponDiscountType` 제거
- [x] `P10-6` `Coupon` 타입 정비 — 미반환 필드 optional 처리
- [x] `P10-7` `discount_type` 분기 검증 — "FIXED"/"RATE" 로직 확인 완료
- [x] `P10-8` `formatDate` 타임스탬프 처리 통일 — 휴리스틱 제거
- [x] `P10-9` 쿠폰 테스트 작성
  ✅ `src/domains/coupon/components/__tests__/CouponListPage.test.tsx` (8 cases)

### 10-C. 기획전(Event) 재설계

- [x] `P10-10` Legacy 타입 삭제 — `EventItem`, `EventStatus` (event/types/index.ts)
- [x] `P10-11` `EventBoardItem` → `BoardItem` 공통 타입 전환 (CS 도메인과 통일)
- [x] `P10-12` status 로직 수정 — 클라이언트 재계산 제거, API `status` 필드 직접 사용
- [x] `P10-13` `formatTs` 타임스탬프 처리 통일 — 쿠폰과 동일 방식 적용
- [x] `P10-14` `web_view_link` 활용 — link/web_view_link 사용 정책 정리
- [x] `P10-15` 기획전 테스트 작성 ✅ `src/domains/event/components/__tests__/EventListPage.test.tsx` (7 cases)

### 10-D. 찜(Favorites) API 연동

- [x] `P10-16` `FavoriteAccommodation` 타입 → StoreItem 기반 재정의 + RecentViewedItem 추가
- [x] `P10-17` 찜 목록 API 연동 — useFavorites() React Query 훅 생성
- [x] `P10-18` 찜 등록/삭제 API 연동 — useMutation 래퍼 (addFavorite/removeFavorites)
- [x] `P10-19` 최근 본 숙소 — useRecentViewed() 로컬스토리지 훅 구현
- [x] `P10-20` FavoritesPage 컴포넌트 재설계 — WishlistCard(StoreItem) + RecentCard 분리
- [x] `P10-21` 찜 테스트 작성
  ✅ `src/domains/favorites/hooks/__tests__/useFavorites.test.ts` (3 cases)

### 10-E. 공통 정리

- [x] `P10-22` Legacy 타입 일괄 삭제 — notice/types 디렉토리 삭제
- [x] `P10-23` 타임스탬프 포맷 유틸 공통화 — `src/lib/utils/formatDate.ts` 생성
- [x] `P10-24` 빌드 + 전체 테스트 통과 확인 ✅ 25 files, 115 tests passed

---

## 완료된 Phase 요약

| Phase | 내용 | 테스트 | 상태 |
|-------|------|--------|------|
| Phase 1 | 인증/회원 + 로그인 상태 관리 + Route Group | 38 cases | 완료 |
| Phase 2 | 마이페이지/회원관리/찜/쿠폰/마일리지 API | 16 cases | 완료 |
| Phase 3 | 소통/CS (알림/공지/FAQ/문의) API | 10 cases | 완료 |
| Phase 4 | 부가 콘텐츠/설정 API | 8 cases | 완료 |
| Phase 5 | Mock → API 전환 (10개 도메인) | 5 cases | 완료 |
| Phase 7 | 마이페이지 API 연동 강화 | — | 완료 (P7-6 보류) |
| Phase 8 | UI/UX 개선 | — | 완료 |
| Phase 9 | 성능/품질 | — | 완료 |
| **합계** | | **77 tests** | |

### 문서

- `docs/api/auth.md` — 인증 API 명세
- `docs/api/mypage.md` — 마이페이지/찜/쿠폰/마일리지 API 명세
- `docs/api/cs.md` — 알림/공지/FAQ/문의 API 명세
- `docs/api/contents.md` — 설정/이벤트/약관/친구추천 API 명세
- `docs/api/mock-to-api-migration.md` — Mock→API 전환 결과
- `docs/test-reports/e2e/` — E2E 테스트 결과 5건
