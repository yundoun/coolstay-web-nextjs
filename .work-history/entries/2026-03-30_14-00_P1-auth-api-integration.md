# Auth API 연동 — Phase 1

## 작업 내용

### 신규 파일
- `src/domains/auth/types/index.ts` — auth 도메인 타입 정의 (Session, Login, Register, CodeSend/Check 등)
- `src/domains/auth/api/authApi.ts` — API 함수 9개 (login, register, code send/check, pw/id find 등)
- `src/lib/stores/auth.ts` — zustand 인증 상태 스토어 (user, token, isLoggedIn)
- `docs/api/auth.md` — auth 도메인 API 명세서 (Swagger 기반 9개 API)
- `docs/technical-decision-checklist.md` — 프로덕션 전환 기술 의사결정 체크리스트

### 수정 파일
- `LoginPage.tsx` — mock → loginWithEmail API 연동, 로딩/에러 상태 추가
- `RegisterPage.tsx` — mock → registerWithEmail API 연동, 인증 데이터 전달 구조 추가
- `PhoneVerificationStep.tsx` — mock → sendAuthCode/checkAuthCode API 연동, onVerified 콜백에 인증 데이터 포함
- `ForgotPasswordPage.tsx` — mock → getAuthMethods/sendAuthCode/findPassword API 연동
- `TASKS.md` — Phase 1~4 태스크 트리 재구성

## 남은 작업
- 소셜 로그인/가입 (카카오/네이버 SDK 세팅 필요)
- 비밀번호 AES-256 암호화 구현
