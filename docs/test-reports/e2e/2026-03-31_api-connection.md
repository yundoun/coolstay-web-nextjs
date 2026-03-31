# E2E API 연결 테스트 결과

> **일시**: 2026-03-31
> **환경**: localhost:3000 → dev.server.coolstay.co.kr:9000 (프록시)
> **방식**: Playwright MCP 직접 조작 (브라우저 네트워크 확인)
> **테스트 계정**: ehdns1133@naver.com

---

## 테스트 결과 요약

| # | API | 엔드포인트 | 상태 | 비고 |
|---|-----|----------|------|------|
| 1 | 임시 토큰 발급 | `POST /auth/sessions/temporary` | **200 OK** | 홈 진입 시 자동 발급 |
| 2 | 이메일 로그인 | `POST /auth/sessions/users` | **200 OK** | 닉네임 "윤도운" 확인 |
| 3 | 홈 메인 | `POST /home/main` | **200 OK** | 배너, 최근 본 숙소, 기획전, 지역별 숙소 로드 |
| 4 | 검색 (지역) | `GET /contents/myArea/list` | **200 OK** | 248개 결과 반환 |
| 5 | 숙소 상세 | `GET /contents/details/list` | **200 OK** | 이미지, 가격, 마일리지 적립률 표시 |
| 6 | 예약 목록 | `GET /reserv/users/list` | **200 OK** | API 연결 정상, 렌더링 에러 있음 |

### 미확인 API (UI 미연결, API 함수만 존재)

| API | 엔드포인트 | 사유 |
|-----|----------|------|
| 마이페이지 조회 | `GET /auth/users/mypage/list` | UI에서 아직 호출하지 않음 (mock 사용 중) |
| 회원정보 변경 | `POST /auth/users/update` | UI 미구현 |
| 비밀번호 확인 | `POST /auth/users/pw/check` | UI 미구현 |
| 회원 탈퇴 | `POST /auth/users/delete` | UI 미구현 |
| 찜 등록/삭제 | `POST /auth/dibs/register`, `delete` | UI 미연결 |
| 쿠폰 목록 | `GET /benefit/coupons/list` | UI에서 mock 사용 중 |
| 마일리지 조회 | `GET /benefit/users/mileage/list` | UI에서 mock 사용 중 |

---

## 발견된 이슈

### ISSUE-1: Protected Route Hydration 리다이렉트 (심각도: 높음)

**현상**: 브라우저에서 `/mypage`, `/bookings` 등 protected 라우트에 직접 접근(주소 입력, 새로고침) 시 로그인 상태임에도 `/login?redirect=...`으로 리다이렉트됨.

**원인**: `(protected)/layout.tsx`에서 `useAuthStore`의 `isLoggedIn`을 즉시 평가하는데, zustand persist의 localStorage hydration이 완료되기 전에 `false`로 판단됨.

**재현 조건**:
1. 로그인 후 헤더에 닉네임 표시 확인
2. 주소창에 `localhost:3000/mypage` 직접 입력 또는 새로고침
3. → `/login?redirect=%2Fmypage`로 리다이렉트됨

**영향**: 클라이언트 네비게이션(링크 클릭)은 정상. full navigation만 영향.

**수정 방향**: hydration 완료 전까지 렌더링을 대기하거나, `persist.hasHydrated()` 체크 후 판단.

→ **fix/hydration-guard** 브랜치에서 수정

### ISSUE-2: 예약 목록 렌더링 에러 (심각도: 중간)

**현상**: `/bookings` 페이지에서 `Cannot read properties of undefined (reading 'bookingId')` 에러 발생.

**원인**: `BookingHistoryPage.tsx:95`에서 `booking.bookingId`를 key prop으로 사용하는데, API 응답 필드명과 타입 정의가 불일치.

**영향**: 예약 목록 페이지가 렌더링되지 않음 (Application error).

→ **fix/booking-list-mapping** 또는 hydration 수정과 함께 처리

---

## 검증 스크린샷

- 홈 화면: 배너 + 최근 본 숙소 + 기획전 정상 로드
- 로그인: 헤더 "윤도운" 표시 확인
- 숙소 상세: "도운텔2", 11,000원, 이미지 갤러리 정상
- 검색: "검색 결과 248개" 표시
