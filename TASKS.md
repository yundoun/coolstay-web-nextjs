# CoolStay Web — 작업 태스크

---

## 미완료 항목

### API 연동 보류

- [ ] `P1-2` 소셜 로그인 API — `POST /auth/sessions/users/sns` (카카오/네이버 SDK 세팅 필요)
- [ ] `P1-7` 소셜 회원가입 API — `POST /auth/users/sns/register` (SDK 세팅 후)
- [ ] `P5-8` favorites 찜 목록 조회 — V2에 목록 API 없음 (V1 `GET /users/motels`만 존재)
- [ ] `P5-13` friend 친구추천 페이지 — 라우트 미존재, API 함수만 준비됨

### 제한사항

- mileage 숙소별 목록 API 없음 — store_key별 상세 조회만 가능, 마이페이지 연동 후 보완 필요
- terms API가 URL 기반 — iframe 표시, CORS 이슈 가능성
- review API 응답 snake_case/camelCase 매핑 — 실제 응답으로 검증 필요

---

## 다음 작업 후보

### A. 소셜 로그인 (카카오/네이버)
- 카카오/네이버 SDK 세팅
- P1-2, P1-7 완료
- 우선순위: 높음 (사용자 유입 채널)

### B. 마이페이지 API 연동 강화
- `getMypageInfo()` → 마이페이지 쿠폰/마일리지/예약 카운트 표시
- `updateUser()` → 프로필 수정 페이지 연결
- `checkPassword()` → 비밀번호 확인 후 정보 수정
- `deleteUser()` → 회원 탈퇴 플로우
- 우선순위: 중간

### C. UI/UX 개선
- 반응형 디자인 검수
- 로딩/에러 상태 통일
- 빈 상태 디자인 일관성
- 숙소 상세 페이지 UI 보강
- 우선순위: 중간

### D. 성능/품질
- React Query 도입 (현재 useState+useEffect → 캐싱/재검증)
- API 응답 타입 snake_case 통일 검증
- 불필요한 mock 데이터 파일 정리
- 우선순위: 낮음

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

### E2E 검증 이력

| 테스트 | 이슈 | 상태 |
|--------|------|------|
| API 연결 (Phase 1~2) | ISSUE-1 hydration, ISSUE-2 예약 매핑 | 수정 완료 |
| Phase 3 | 없음 | 완료 |
| Phase 4 | 없음 | 완료 |
| Phase 5 mock→API | ISSUE-3 쿠폰 날짜 포맷 | 수정 완료 |

### 문서

- `docs/api/auth.md` — 인증 API 명세
- `docs/api/mypage.md` — 마이페이지/찜/쿠폰/마일리지 API 명세
- `docs/api/cs.md` — 알림/공지/FAQ/문의 API 명세
- `docs/api/contents.md` — 설정/이벤트/약관/친구추천 API 명세
- `docs/api/mock-to-api-migration.md` — Mock→API 전환 결과
- `docs/test-reports/e2e/` — E2E 테스트 결과 4건
