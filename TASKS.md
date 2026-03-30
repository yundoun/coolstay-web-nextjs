# API 연동 — Mock → 실제 API 전환

> **진행률**: 9 / 24 (37%)

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

---

## Phase 2 — 마이페이지/회원관리 `branch: feat/phase2-mypage`

> Swagger `/api/v2/mobile/auth/users` 중 회원정보 + 마이페이지 + 찜 + 쿠폰 + 마일리지

### Users (회원정보 관리)
- [ ] `P2-1` 마이페이지 정보 조회 API 연동 — `GET /auth/users/mypage/list`
- [ ] `P2-2` 회원정보 변경 API 연동 — `POST /auth/users/update`
- [ ] `P2-3` 비밀번호 확인 API 연동 — `POST /auth/users/pw/check`
- [ ] `P2-4` 회원 탈퇴 API 연동 — `POST /auth/users/delete`

### Dibs (찜/즐겨찾기)
- [ ] `P2-5` 찜 등록 API 연동 — `POST /auth/dibs/register`
- [ ] `P2-6` 찜 삭제 API 연동 — `POST /auth/dibs/delete`

### 쿠폰 / 마일리지
- [ ] `P2-7` COUPON 쿠폰 목록/등록 API 연동
- [ ] `P2-8` MILEAGE 마일리지 내역 API 연동

### 명세 + 마무리
- [ ] `P2-9` mypage 도메인 API 명세서 작성 (`docs/api/mypage.md`)

---

## Phase 3 — 소통/CS `branch: feat/phase3-cs`

### Alarms (알림)
- [ ] `P3-1` 알림 목록 조회 API 연동 — `GET /auth/alarms/users/list`
- [ ] `P3-2` 알림 삭제 API 연동 — `POST /auth/alarms/delete`
- [ ] `P3-3` 알림카드 상태 변경 API 연동 — `POST /auth/alarms/card/update`

### CS (문의/공지/FAQ)
- [ ] `P3-4` INQUIRY 1:1 문의 목록/작성 API 연동
- [ ] `P3-5` NOTICE 공지사항 목록/상세 API 연동
- [ ] `P3-6` FAQ 카테고리/목록 API 연동

### 명세 + 마무리
- [ ] `P3-7` cs 도메인 API 명세서 작성 (`docs/api/cs.md`)

---

## Phase 4 — 부가 콘텐츠/설정 `branch: feat/phase4-contents`

### Settings (설정)
- [ ] `P4-1` 설정 목록 조회 API 연동 — `GET /auth/users/settings/list`
- [ ] `P4-2` 설정 변경 API 연동 — `POST /auth/users/settings/update`

### 부가
- [ ] `P4-3` EVENT 이벤트/기획전 목록/상세 API 연동
- [ ] `P4-4` GUIDE 이용 가이드 API 연동
- [ ] `P4-5` TERMS 약관 내용 API 연동
- [ ] `P4-6` 친구추천 조회/등록 API 연동 — `GET/POST /auth/users/friend/*`

### 명세 + 마무리
- [ ] `P4-7` contents/settings 도메인 API 명세서 작성

---

## 제외 (웹 불필요 또는 별도 검토)

- `POST /auth/users/refresh/push-token` — 푸시 토큰 갱신 (웹 푸시 도입 시 별도 검토)
- `POST /auth/sessions/temporary` — 이미 연동 완료 (`lib/api/client.ts`)
