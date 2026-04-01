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

## Phase 10 — API 실제 응답 기반 재설계 `branch: feat/phase10-api-redesign`

> 2026-04-01 dev 서버 실제 API 호출 결과 기반으로 타입/컴포넌트 수정

### 10-0. 공통 타입 수정 (BoardItem)

> `BoardItem` 은 가이드/기획전/공지/FAQ/문의 공용. 실제 응답에 맞게 재정의.

- [x] `P10-0a` `BoardItem.key` 타입 `string` → `number` 수정
- [x] `P10-0b` `BoardItem.link` 타입 `string` → `BoardItemLink` 객체로 변경
- [x] `P10-0c` `BoardItem.images` 제거, `image_urls: string[]` 추가
- [x] `P10-0d` `BoardItem.web_view_link` → `webview_link` 필드명 수정
- [x] `P10-0e` 신규 필드 추가: `badge_image_url`, `detail_banner_image_url`, `buttons[]`, `thumb_description`
- [x] `P10-0f` 타임스탬프 **초 단위** — `formatTimestamp`에 자동 변환 적용

### 10-A. 꿀팁 가이드 재설계

> 실제 응답: `{ key(number), title, image_urls(string[]), link(object), view_count, reg_dt(초) }`
> description, banner_image_url, webview_link 은 가이드에선 반환되지 않음

- [x] `P10-1` 목록 UI — `image_urls[0]` 썸네일 + 2컬럼 카드 그리드
- [x] `P10-2` 목록 부제 — `view_count` + `reg_dt` 메타데이터 표시
- [x] `P10-3` 상세 UI — `image_urls[]` 갤러리 + 히어로 이미지
- [x] `P10-4` 상세 CTA — `link.btn_name` 기반 버튼
- [x] `P10-5` 가이드 테스트 재작성 ✅ (10 cases)

### 10-B. 기획전(Event) 재설계

> 실제 응답: `{ key(number), type, title, description, badge_image_url, detail_banner_image_url, webview_link, image_urls[], link(object), buttons[], status("BI005"등), start_dt(초), end_dt(초), reg_dt(초), thumb_description }`
> banner_image_url 은 반환되지 않음, status 는 코드값("BI005") 사용

- [x] `P10-6` 목록 이미지 — `badge_image_url` 사용 + 2컬럼 그리드
- [x] `P10-7` status — 날짜 기반 판단 (코드값 불투명)
- [x] `P10-8` 상세 — `detail_banner_image_url` 히어로 + `image_urls[]` 갤러리
- [x] `P10-9` 상세 CTA — `buttons[]` 배열 렌더링
- [x] `P10-10` `webview_link` 필드명 수정 완료
- [x] `P10-11` 타임스탬프 — `formatTimestampDot` + `toMillis` 적용
- [x] `P10-12` 기획전 테스트 재작성 ✅ (18 cases)

### 10-C. 쿠폰 재설계

> 실제 응답: 대부분 현재 타입과 일치. discount_type 값과 타임스탬프 단위만 수정 필요.

- [x] `P10-13` `discount_type` — `"AMOUNT"`→원, `"RATE"`→% 수정
- [x] `P10-14` `received` 삭제, 모든 필드 실제 응답 기준 필수/타입 재정의
- [x] `P10-15` `day_codes: string[]` 추가
- [x] `P10-16` 타임스탬프 — `formatTimestampDot` 적용, 7일 만료 뱃지
- [x] `P10-17` 쿠폰 테스트 재작성 ✅ (14 cases)

### 10-D. 공통 유틸

- [x] `P10-18` `formatTimestamp` — 초 단위 자동 감지, `formatTimestampDot`/`toMillis` 추가
- [x] `P10-19` 빌드 + 전체 테스트 통과 ✅ 25 files, 139 tests

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
| Phase 10 (1차) | API 응답 구조 재설계 — Legacy 삭제/타입 정비/찜 연동 | 22 cases | 완료 |
| **합계** | | **99 tests** | |

### 문서

- `docs/api/auth.md` — 인증 API 명세
- `docs/api/mypage.md` — 마이페이지/찜/쿠폰/마일리지 API 명세
- `docs/api/cs.md` — 알림/공지/FAQ/문의 API 명세
- `docs/api/contents.md` — 설정/이벤트/약관/친구추천 API 명세
- `docs/api/mock-to-api-migration.md` — Mock→API 전환 결과
- `docs/test-reports/e2e/` — E2E 테스트 결과 5건
