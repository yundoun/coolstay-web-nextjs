# API 연동 — Mock → 실제 API 전환

> **진행률**: 35 / 34 (100%)

---

## E2E API 연결 테스트 `branch: feat/e2e-api-test`

> **목표**: Playwright로 실제 dev 서버 API 연결 상태 검증
> **방식**: `request` context로 직접 API 호출 (UI 불필요)
> **서버**: `http://dev.server.coolstay.co.kr:9000`

### 결과: Playwright MCP 직접 조작으로 검증 (2026-03-31)

- [x] 임시 토큰 발급 `POST /auth/sessions/temporary` → 200 OK
- [x] 이메일 로그인 `POST /auth/sessions/users` → 200 OK
- [x] 홈 메인 `POST /home/main` → 200 OK
- [x] 검색 `GET /contents/myArea/list` → 200 OK (248건)
- [x] 숙소 상세 `GET /contents/details/list` → 200 OK
- [x] 예약 목록 `GET /reserv/users/list` → 200 OK (렌더링 에러 있음)
- [ ] MyPage/Dibs/Coupon/Mileage — UI 미연결 (API 함수만 존재, mock 사용 중)

### 발견된 이슈

- **ISSUE-1** Protected Route Hydration 리다이렉트 → `fix/hydration-guard`
- **ISSUE-2** 예약 목록 렌더링 에러 (bookingId undefined) → `fix/booking-list-mapping`

> 상세: `docs/test-reports/e2e/2026-03-31_api-connection.md`

---

## Phase 1 — 인증/회원 `branch: feat/phase1-auth`

> Swagger `/api/v2/mobile/auth` 도메인 중 인증 핵심 플로우

### Session (세션/로그인)
- [x] `P1-1` 이메일 로그인 API 연동 — `POST /auth/sessions/users`
- [ ] `P1-2` 소셜 로그인 API 연동 — `POST /auth/sessions/users/sns` (카카오/네이버 SDK 세팅 필요)

### Auth (인증코드)
- [x] `P1-3` 인증번호 발송 API 연동 — `POST /auth/code/send`
- [x] `P1-4` 인증번호 확인 API 연동 — `POST /auth/code/check`
- [x] `P1-5` 인증수단 조회 API 연동 — `GET /auth/code/list`

### Users (회원가입)
- [x] `P1-6` 이메일 회원가입 API 연동 — `POST /auth/users/register`
- [ ] `P1-7` 소셜 회원가입 API 연동 — `POST /auth/users/sns/register` (SDK 세팅 후)

### Users (계정 찾기)
- [x] `P1-8` 비밀번호 찾기 API 연동 — `POST /auth/users/pw/find`
- [x] `P1-9` 아이디 찾기 API 연동 — `POST /auth/users/id/find`

### 명세 + 마무리
- [x] `P1-10` auth 도메인 API 명세서 작성 (`docs/api/auth.md`)

### 로그인 상태 관리 + Route Group 리팩토링

> **목표**: 임시 토큰 제거, 토큰 일원화, Route Group 기반 인증 가드

#### Step 1 — 토큰 관리 일원화
- [x] `P1-11` client.ts 토큰 흐름 리팩토링
  - setClientToken / clearClientToken export
  - auth store → client 토큰 동기화
  - ✅ `src/lib/api/__tests__/client.test.ts` (11 cases)
  - ✅ `src/lib/stores/__tests__/auth.test.ts` (4 cases)
- [x] `P1-12` auth store에 localStorage 영속화 추가 (zustand persist)
  - 새로고침 시 로그인 유지
  - hydration 완료 후 client 토큰 복원
  - ✅ `src/lib/stores/__tests__/auth-persist.test.ts` (6 cases)

#### Step 2 — Route Group 재구성
- [x] `P1-13` `(public)` Route Group 생성 — 파일 이동
  - `login/`, `register/`, `forgot-password/`, `search/`, `accommodations/[id]/`
  - `events/`, `notices/`, `faq/`, `guide/`, `terms/`, `page.tsx` (홈)
  - ✅ 빌드 성공으로 검증
- [x] `P1-14` `(protected)` Route Group 생성 — 파일 이동
  - `mypage/`, `bookings/`, `booking/`, `favorites/`, `reviews/`
  - `inquiries/`, `notifications/`, `coupons/`, `mileage/`, `settings/`
  - ✅ 빌드 성공으로 검증
- [x] `P1-15` `(protected)/layout.tsx` — 인증 가드 레이아웃 작성
  - 비로그인 시 `/login?redirect=원래경로`로 리다이렉트
  - 로그인 시 children 렌더링
  - ✅ `src/app/(protected)/__tests__/layout.test.tsx` (3 cases)

#### Step 3 — UI 반영
- [x] `P1-16` Header 로그인 상태 반영
  - 비로그인: "로그인" 버튼 → /login
  - 로그인: 닉네임 표시 → /mypage
  - ✅ `src/components/layout/Header/__tests__/Header.test.tsx` (4 cases)
- [x] `P1-17` BottomNav 로그인 상태 반영
  - 비로그인: 마이페이지 → /login으로 이동
  - ✅ `src/components/layout/__tests__/BottomNav.test.tsx` (2 cases)
- [x] `P1-18` MyPage mockUser → auth store 실제 유저 정보 연결
  - ✅ `src/domains/mypage/components/__tests__/MyPage.test.tsx` (3 cases)
- [x] `P1-19` 로그아웃 기능 구현
  - clearSession + 홈으로 이동
  - ✅ `src/domains/mypage/components/__tests__/MyPage.test.tsx` (2 cases)

#### Step 4 — 로그인 후 복귀
- [x] `P1-20` 로그인 성공 시 redirect 파라미터로 원래 페이지 복귀
  - `/login?redirect=/bookings` → 로그인 후 `/bookings`로 이동
  - 외부 URL redirect 방지 (보안)
  - ✅ `src/domains/auth/components/__tests__/LoginPage.test.tsx` (3 cases)

---

## Phase 2 — 마이페이지/회원관리 `branch: feat/phase2`

> Swagger `/api/v2/mobile/auth/users` 중 회원정보 + 마이페이지 + 찜 + 쿠폰 + 마일리지

### Users (회원정보 관리)
- [x] `P2-1` 마이페이지 정보 조회 API 연동 — `GET /auth/users/mypage/list`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (1 case)
- [x] `P2-2` 회원정보 변경 API 연동 — `POST /auth/users/update`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (1 case)
- [x] `P2-3` 비밀번호 확인 API 연동 — `POST /auth/users/pw/check`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (2 cases)
- [x] `P2-4` 회원 탈퇴 API 연동 — `POST /auth/users/delete`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (1 case)

### Dibs (찜/즐겨찾기)
- [x] `P2-5` 찜 등록 API 연동 — `POST /auth/dibs/register`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (1 case)
- [x] `P2-6` 찜 삭제 API 연동 — `POST /auth/dibs/delete`
  - ✅ `src/domains/mypage/api/__tests__/mypageApi.test.ts` (1 case)

### 쿠폰 / 마일리지
- [x] `P2-7` COUPON 쿠폰 목록/등록/다운로드/삭제 API 연동
  - GET /benefit/coupons/list, POST register/download/delete
  - ✅ `src/domains/coupon/api/__tests__/couponApi.test.ts` (7 cases)
- [x] `P2-8` MILEAGE 마일리지 API 연동
  - GET /benefit/users/mileage/list (AOS 코드에서 확인, Swagger 미등록)
  - POST /benefit/mileage/delete
  - ✅ `src/domains/mileage/api/__tests__/mileageApi.test.ts` (3 cases)

### 명세 + 마무리
- [x] `P2-9` mypage 도메인 API 명세서 작성 (`docs/api/mypage.md`)

---

## Phase 3 — 소통/CS `branch: feat/phase3-cs`

### Alarms (알림)
- [x] `P3-1` 알림 목록 조회 API 연동 — `GET /auth/alarms/users/list`
  - ✅ `src/domains/alarm/api/__tests__/alarmApi.test.ts` (2 cases)
- [x] `P3-2` 알림 삭제 API 연동 — `POST /auth/alarms/delete`
  - ✅ `src/domains/alarm/api/__tests__/alarmApi.test.ts` (1 case)
- [x] `P3-3` 알림카드 상태 변경 API 연동 — `POST /auth/alarms/card/update`
  - ✅ `src/domains/alarm/api/__tests__/alarmApi.test.ts` (1 case)

### CS (문의/공지/FAQ) — `/manage/board` 통합 API
- [x] `P3-4` INQUIRY 1:1 문의 목록/작성/삭제 API 연동
  - ✅ `src/domains/cs/api/__tests__/csApi.test.ts` (3 cases)
- [x] `P3-5` NOTICE 공지사항 목록/상세 API 연동
  - ✅ `src/domains/cs/api/__tests__/csApi.test.ts` (2 cases)
- [x] `P3-6` FAQ 목록 API 연동
  - ✅ `src/domains/cs/api/__tests__/csApi.test.ts` (1 case)

### 명세 + 마무리
- [x] `P3-7` cs 도메인 API 명세서 작성 (`docs/api/cs.md`)

---

## Phase 4 — 부가 콘텐츠/설정 `branch: feat/phase4-contents`

### Settings (설정)
- [x] `P4-1` 설정 목록 조회 API 연동 — `GET /auth/users/settings/list`
  - ✅ `src/domains/settings/api/__tests__/settingsApi.test.ts` (1 case)
- [x] `P4-2` 설정 변경 API 연동 — `POST /auth/users/settings/update`
  - ✅ `src/domains/settings/api/__tests__/settingsApi.test.ts` (1 case)

### 부가
- [x] `P4-3` EVENT 이벤트/기획전 목록 API 연동 — `GET /manage/event/list`
  - ✅ `src/domains/event/api/__tests__/eventApi.test.ts` (2 cases)
- [x] `P4-4` GUIDE 이용 가이드 — AOS/서버에 API 없음, 제외
- [x] `P4-5` TERMS 약관 조회 API 연동 — `GET /manage/terms/list`
  - ✅ `src/domains/terms/api/__tests__/termsApi.test.ts` (2 cases)
- [x] `P4-6` 친구추천 조회/등록 API 연동 — `GET/POST /auth/users/friend/*`
  - ✅ `src/domains/friend/api/__tests__/friendApi.test.ts` (2 cases)

### 명세 + 마무리
- [x] `P4-7` contents/settings 도메인 API 명세서 작성 (`docs/api/contents.md`)

---

## Phase 5 — Mock → API 전환 `branch: feat/phase5-mock-to-api`

> **목표**: API 함수가 준비된 도메인의 UI를 mock 데이터에서 실제 API 호출로 전환

### Step 1 — API 함수 준비 완료, mock → API 전환 (6개)
- [x] `P5-1` coupon — hook + CouponListPage API 전환 완료
  - ✅ `src/domains/coupon/hooks/__tests__/useCouponList.test.ts` (2 cases)
- [x] `P5-3` event — hook + EventListPage API 전환 완료
- [ ] `P5-2` mileage — hook 준비, 컴포넌트 전환 대기 (API 응답 확인 필요)
- [ ] `P5-4` settings — hook 준비, 컴포넌트 전환 대기 (API 응답 확인 필요)
- [ ] `P5-5` terms — hook 준비, 컴포넌트 전환 대기 (API 응답 확인 필요)
- [ ] `P5-6` review — hook 준비, 컴포넌트 전환 대기 (API 응답 확인 필요)

### Step 2 — API 미존재, AOS/서버 코드 탐색 후 구현 (4개)
- [ ] `P5-7` notification → alarm API로 전환 (alarmApi 활용)
- [ ] `P5-8` favorites → dibs API 목록 조회 추가 (AOS 코드 탐색 필요)
- [ ] `P5-9` inquiry → csApi(board_type=INQUIRY)로 전환
- [ ] `P5-10` guide — API 없음, 정적 콘텐츠 유지 또는 board API 확인

### Step 3 — 컴포넌트 없는 도메인 UI 구현 (3개)
- [ ] `P5-11` alarm — 알림 페이지 UI + alarmApi 연동
- [ ] `P5-12` cs(공지/FAQ) — csApi(board_type=NOTICE/FAQ)로 전환
- [ ] `P5-13` friend — 친구추천 페이지 UI + friendApi 연동

### 명세 + 마무리
- [ ] `P5-14` mock → API 전환 결과 명세서 업데이트

---

## 제외 (웹 불필요 또는 별도 검토)

- `POST /auth/users/refresh/push-token` — 푸시 토큰 갱신 (웹 푸시 도입 시 별도 검토)
- `POST /auth/sessions/temporary` — 비로그인 시 API 호출용 (P1-11에서 흐름 정리)
