# CoolStay Web — 작업 태스크

---

## Phase 6 — 소셜 로그인 `branch: feat/phase6-social-auth`

> 카카오/네이버 SDK 세팅 + 소셜 로그인/회원가입 연동

- [ ] `P6-1` 카카오 SDK 세팅 (JavaScript SDK 초기화, 앱 키 설정)
- [ ] `P6-2` 네이버 SDK 세팅 (네이버 로그인 API 초기화)
- [ ] `P6-3` 소셜 로그인 API 연동 — `POST /auth/sessions/users/sns`
  - 카카오 토큰 → enc_sns_uid 암호화 → API 호출
  - 네이버 토큰 → enc_sns_uid 암호화 → API 호출
- [ ] `P6-4` 소셜 회원가입 API 연동 — `POST /auth/users/sns/register`
  - 미가입 유저 → 약관 동의 + 전화번호 인증 → 가입
- [ ] `P6-5` LoginPage 소셜 버튼 실제 동작 연결
- [ ] `P6-6` RegisterPage 소셜 가입 플로우 연결

---

## Phase 7 — 마이페이지 API 연동 강화 `branch: feat/phase7-mypage`

> 마이페이지 내 모든 기능을 실제 API로 연결

### 마이페이지 홈
- [x] `P7-1` MyPage 쿠폰/마일리지/예약 카운트 → `getMypageInfo()` 연동
- [x] `P7-2` 찜 목록 → `GET /contents/list?search_type=ST006` (AOS 코드에서 확인)
  - `getDibsList()` 함수 추가

### 프로필 수정
- [x] `P7-3` ProfileEditPage → `updateUser()` + auth store 연동
  - mock 제거, auth store에서 유저 정보 표시
  - 닉네임/이름 변경 → API 호출 → 세션 갱신
  - 전화번호 변경 → SMS 인증 → API 호출 → 세션 갱신
- [x] `P7-4` PasswordChangePage → `encryptPassword()` + `updateUser()` 연동
  - 비밀번호 AES 암호화 → API 호출 → 세션 갱신

### 회원 탈퇴
- [x] `P7-5` WithdrawPage → `getMypageInfo()` + `deleteUser()` 연동
  - 실제 쿠폰/마일리지/예약 카운트 표시
  - 탈퇴 → clearSession + 홈 이동

### 친구추천
- [ ] `P7-6` 친구추천 페이지 라우트 + UI 구현 → `friendApi` 연동 (보류)

---

## Phase 8 — UI/UX 개선 `branch: feat/phase8-ui`

> 전체 앱 품질 개선

### 상태 표시 통일
- [x] `P8-1` 로딩 컴포넌트 통일 (공통 Skeleton/Spinner)
  ✅ `src/components/ui/__tests__/loading-spinner.test.tsx` (6 cases)
- [x] `P8-2` 에러 상태 통일 (공통 ErrorState 컴포넌트)
  ✅ `src/components/ui/__tests__/error-state.test.tsx` (5 cases)
- [x] `P8-3` 빈 상태 디자인 일관성 검수 (공통 EmptyState 컴포넌트)
  ✅ `src/components/ui/__tests__/empty-state.test.tsx` (5 cases)

### 페이지별 개선
- [x] `P8-4` 숙소 상세 페이지 UI 보강 (객실 목록, 편의시설 등)
  - 공통 LoadingSpinner/EmptyState 적용
  - 편의시설 아이콘 8→16개 확장 (에어컨, 난방, 욕조, 드라이어 등)
  - 객실 카드에 체크인/아웃 시간 표시 추가
- [x] `P8-5` 검색 결과 페이지 무한 스크롤 / 필터 UX
  - IntersectionObserver 기반 무한 스크롤 구현 (12개씩 로드)
  - 공통 LoadingSpinner/EmptyState 적용
  - 결과 표시 완료 메시지 추가
- [x] `P8-6` 예약 상세 페이지 UI 검수
  - BookingDetailPage, BookingPageClient에 공통 LoadingSpinner/EmptyState 적용
- [ ] `P8-7` 반응형 디자인 검수 (모바일/태블릿/데스크톱)

---

## Phase 9 — 성능/품질 `branch: feat/phase9-quality`

> 코드 품질 + 성능 최적화

### React Query 확대
- [ ] `P9-1` coupon/event/settings/terms/review/mileage hook → React Query 전환
  - 현재 useState+useEffect → useQuery로 교체
  - 캐싱/재검증/로딩 상태 자동 관리
- [ ] `P9-2` notification/notice/faq/inquiry 직접 호출 → React Query 전환

### API 타입 정합성
- [ ] `P9-3` API 응답 snake_case 통일 검증 (dev 서버 실제 응답 기준)
  - booking 외 다른 도메인도 camelCase/snake_case 불일치 점검
- [ ] `P9-4` 불필요한 mock 데이터 파일 정리 (11개 미사용 mock 삭제)
- [ ] `P9-5` 아직 mock 사용 중인 컴포넌트 4개 전환
  - search (SearchPageLayout, SearchInfoBar)
  - accommodation (AccommodationDetailPage — mock fallback 제거)
  - guide (정적 콘텐츠 유지 또는 board API)
  - favorites (V1 API 검토)

### 빌드/린트
- [ ] `P9-6` LoginPage `useSearchParams` Suspense boundary 수정 (빌드 경고)
- [ ] `P9-7` TypeScript strict 모드 점검

---

## 완료된 Phase 요약

| Phase | 내용 | 테스트 | 상태 |
|-------|------|--------|------|
| Phase 1 | 인증/회원 + 로그인 상태 관리 + Route Group | 38 cases | 완료 |
| Phase 2 | 마이페이지/회원관리/찜/쿠폰/마일리지 API | 16 cases | 완료 |
| Phase 3 | 소통/CS (알림/공지/FAQ/문의) API | 10 cases | 완료 |
| Phase 4 | 부가 콘텐츠/설정 API | 8 cases | 완료 |
| Phase 5 | Mock → API 전환 (10개 도메인) | 5 cases | 완료 |
| **합계** | | **77 tests** | |

### 문서

- `docs/api/auth.md` — 인증 API 명세
- `docs/api/mypage.md` — 마이페이지/찜/쿠폰/마일리지 API 명세
- `docs/api/cs.md` — 알림/공지/FAQ/문의 API 명세
- `docs/api/contents.md` — 설정/이벤트/약관/친구추천 API 명세
- `docs/api/mock-to-api-migration.md` — Mock→API 전환 결과
- `docs/test-reports/e2e/` — E2E 테스트 결과 5건
