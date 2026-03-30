# 로그인 상태 관리 + Route Group + TDD 도입 [P1-11~20]

## 작업 내용

### Step 1 — 토큰 관리 일원화
- `client.ts`에 `setClientToken`/`clearClientToken` export 추가
- auth store `setSession`/`clearSession`에서 client 토큰 동기화
- zustand persist로 localStorage 영속화 + hydration 시 client 토큰 복원

### Step 2 — Route Group 재구성
- `(public)` Route Group: login, register, forgot-password, search, accommodations, events, notices, faq, guide, terms, 홈
- `(protected)` Route Group: mypage, bookings, booking, favorites, reviews, inquiries, notifications, coupons, mileage, settings
- `(protected)/layout.tsx` 인증 가드: 비로그인 시 `/login?redirect=현재경로`로 리다이렉트

### Step 3 — UI 반영
- Header: 비로그인→"로그인" 버튼, 로그인→닉네임 표시+마이페이지 링크
- BottomNav: 비로그인 시 마이페이지 탭→/login으로 이동
- MyPage: mockUser 제거, auth store 실제 유저 정보 연결
- 로그아웃: clearSession + 홈 이동

### Step 4 — 로그인 후 복귀
- `useSearchParams`로 redirect 파라미터 읽어서 원래 경로로 복귀
- 외부 URL redirect 방지 (보안)

### TDD 도입
- Vitest + jsdom + @testing-library/react 세팅
- 38개 테스트 케이스 작성 (Red → Green 사이클)

## 변경 파일
- `src/lib/api/client.ts` — TokenPair export, setClientToken, clearClientToken
- `src/lib/stores/auth.ts` — zustand persist 적용
- `src/app/(public)/`, `src/app/(protected)/` — Route Group 재구성
- `src/components/layout/Header/Header.tsx` — 로그인 상태 분기
- `src/components/layout/BottomNav.tsx` — 마이페이지 링크 분기
- `src/domains/mypage/components/MyPage.tsx` — auth store 연결 + 로그아웃
- `src/domains/auth/components/LoginPage.tsx` — redirect 복귀
- `vitest.config.ts`, `package.json` — 테스트 도구 세팅
