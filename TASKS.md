# CoolStay Web — 작업 태스크

---

## Phase 6 — 소셜 로그인 `branch: feat/phase6-social-auth` (보류)

> 개발자 콘솔 준비 중

---

## Phase 11 — API 실제 응답 검증 및 명세 수정

> 모든 API 엔드포인트를 dev 서버에서 실제 호출하여 응답 구조를 검증하고,
> 명세서(docs/api/)와 타입(types/)을 실제 응답 기준으로 수정한다.
>
> **방법**: 각 엔드포인트를 curl로 호출 → 실제 JSON 응답 확인 → 타입/명세 불일치 수정

### Phase 11-A — 홈/검색/숙소 `branch: feat/phase11a-verify-contents`

> 가장 핵심이 되는 콘텐츠 API 검증 (13개 엔드포인트)

#### 홈 (2개)
- [x] `P11A-1` `POST /home/main` 실제 응답 검증 → home.md 전면 업데이트
  - banners[], exhibitions[], item_buttons[], recommend_stores[] 등 9개 필드 확인
  - **기획전은 exhibitions[] 배열로 홈에서 반환, type="EXHIBITION"**
- [x] `P11A-2` `POST /home/regionStores` 실제 응답 검증 → recommend_categories + recommend_stores

#### 검색 (6개)
- [x] `P11A-3` `GET /contents/regions/list` 실제 응답 검증 → 17개 지역, sub_regions 구조 확인
- [ ] `P11A-4` `GET /contents/list` 실제 응답 검증 — 빈 결과 반환 (파라미터 추가 조사 필요)
- [x] `P11A-5` `GET /contents/total/list` 실제 응답 검증 → total_count + search_results[]
- [ ] `P11A-6` `GET /contents/filter` 실제 응답 검증 — 에러 반환 (파라미터 추가 조사 필요)
- [ ] `P11A-7` `POST /contents/filter/list` 실제 응답 검증 (미호출)
- [ ] `P11A-8` `GET /contents/myArea/list` 실제 응답 검증 (미호출)

#### 숙소 상세 (4개)
- [x] `P11A-9` `GET /contents/details/list` 실제 응답 검증 → motel 37개 필드 확인, contents-detail.md 업데이트
- [x] `P11A-10` `GET /contents/images/list` 실제 응답 검증 → images_per_category[] 구조
- [x] `P11A-11` `GET /contents/books/daystatus/list` 실제 응답 검증 → daily_books[]
- [ ] `P11A-12` `GET /contents/refund-policy/list` 실제 응답 검증 — 에러 반환 (파라미터 추가 조사 필요)

#### 기획전 신규
- [x] `P11A-13` `GET /aiMagazine/board/list` 실제 응답 확인 → **칼럼/매거진 API** (기획전 아님)
- [x] `P11A-14` `GET /aiMagazine/board/detail` 실제 응답 확인 → board_detail 구조
- [x] `P11A-15` `/exhibitions` 라우트 + ExhibitionListPage/ExhibitionDetailPage 신규 생성
  - 기획전 = `POST /home/main` → exhibitions[] + `GET /manage/board/list?board_type=EVENT&board_item_key`
  - exhibition 도메인 생성 (api, hooks, components, routes)

### Phase 11-B — 예약/리뷰 `branch: feat/phase11b-verify-booking`

> 예약 플로우 + 리뷰 (14개 엔드포인트)

#### 예약 (9개)
- [x] `P11B-1` `GET /reserv/users/payments/list` 검증 → UserPaymentInfoResponse 전면 교체
- [ ] `P11B-2` `POST /reserv/ready` — 파괴적 (실제 예약 생성), AOS 코드 참조
- [ ] `P11B-3` `POST /reserv/register` — 파괴적, AOS 코드 참조
- [ ] `P11B-4` `GET /reserv/users/list` — 파라미터 에러 (추가 조사 필요)
- [x] `P11B-5` `GET /reserv/users/upcoming` 검증 → total_count + books[]
- [ ] `P11B-6` `GET /reserv/guest/list` — 미호출
- [ ] `P11B-7` `POST /reserv/delete` — 파괴적, AOS 코드 참조
- [ ] `P11B-8` `POST /reserv/users/delete` — 파괴적, AOS 코드 참조
- [ ] `P11B-9` `GET /reserv/receipt` — 미호출

#### 리뷰 (5개)
- [x] `P11B-10` `GET /contents/reviews/list` 검증 → Review 타입 수정 (reg_dt, user, status_info, ReviewImage)
- [ ] `P11B-11` `POST /contents/reviews/register` — 파괴적, AOS 코드 참조
- [ ] `P11B-12` `POST /contents/reviews/update` — 파괴적, AOS 코드 참조
- [ ] `P11B-13` `POST /contents/reviews/delete` — 파괴적, AOS 코드 참조
- [ ] `P11B-14` `POST /contents/reviews/status/update` — 파괴적, AOS 코드 참조

### Phase 11-C — 인증/마이페이지/회원 `branch: feat/phase11c-verify-auth`

> 인증 + 마이페이지 + 찜/마일리지 (20개 엔드포인트)

#### 인증 (9개)
- [ ] `P11C-1` `POST /auth/sessions/users` 실제 응답 검증 → auth.md 수정
- [ ] `P11C-2` `POST /auth/code/send` 실제 응답 검증
- [ ] `P11C-3` `POST /auth/code/check` 실제 응답 검증
- [ ] `P11C-4` `GET /auth/code/list` 실제 응답 검증
- [ ] `P11C-5` `POST /auth/users/register` 실제 응답 검증
- [ ] `P11C-6` `POST /auth/users/pw/find` 실제 응답 검증
- [ ] `P11C-7` `POST /auth/users/id/find` 실제 응답 검증
- [ ] `P11C-8` `POST /auth/sessions/users/sns` 응답 구조 확인 (호출 불가 시 AOS 코드 참조)
- [ ] `P11C-9` `POST /auth/users/sns/register` 응답 구조 확인

#### 마이페이지 (4개)
- [ ] `P11C-10` `GET /auth/users/mypage/list` 실제 응답 검증 → mypage.md 수정
- [ ] `P11C-11` `POST /auth/users/update` 실제 응답 검증
- [ ] `P11C-12` `POST /auth/users/pw/check` 실제 응답 검증
- [ ] `P11C-13` `POST /auth/users/delete` 응답 구조 확인 (파괴적 — AOS 코드 참조)

#### 찜 (3개)
- [ ] `P11C-14` `GET /contents/list?search_type=ST006` 실제 응답 검증
- [ ] `P11C-15` `POST /auth/dibs/register` 실제 응답 검증
- [ ] `P11C-16` `POST /auth/dibs/delete` 실제 응답 검증

#### 마일리지 (2개)
- [ ] `P11C-17` `GET /benefit/users/mileage/list` 실제 응답 검증
- [ ] `P11C-18` `POST /benefit/mileage/delete` 실제 응답 검증

### Phase 11-D — CS/설정/기타 `branch: feat/phase11d-verify-cs`

> 알림/공지/FAQ/문의 + 설정/약관/친구추천 (11개 엔드포인트)

#### 알림 (3개)
- [ ] `P11D-1` `GET /auth/alarms/users/list` 실제 응답 검증 → cs.md 수정
- [ ] `P11D-2` `POST /auth/alarms/card/update` 실제 응답 검증
- [ ] `P11D-3` `POST /auth/alarms/delete` 실제 응답 검증

#### 게시판 — 공지/FAQ/문의 (3개, 같은 엔드포인트)
- [ ] `P11D-4` `GET /manage/board/list?board_type=NOTICE` 실제 응답 검증
- [ ] `P11D-5` `GET /manage/board/list?board_type=FAQ` 실제 응답 검증
- [ ] `P11D-6` `GET /manage/board/list?board_type=INQUIRY` 실제 응답 검증 (로그인 필요)

#### 설정 (2개)
- [ ] `P11D-7` `GET /auth/users/settings/list` 실제 응답 검증 → contents.md 수정
- [ ] `P11D-8` `POST /auth/users/settings/update` 실제 응답 검증

#### 약관 (1개)
- [ ] `P11D-9` `GET /manage/terms/list` 실제 응답 검증

#### 친구추천 (2개)
- [ ] `P11D-10` `GET /auth/users/friend/list` 실제 응답 검증 (로그인 필요)
- [ ] `P11D-11` `POST /auth/users/friend/register` 실제 응답 검증

---

## 검증 완료 API (Phase 10에서 확인)

| 엔드포인트 | 검증일 | 주요 발견 |
|-----------|--------|----------|
| `GET /manage/board/list?board_type=GUIDE` | 2026-04-01 | key:number, image_urls:string[], reg_dt 초단위, description 없음 |
| `GET /manage/board/list?board_type=EVENT` | 2026-04-01 | badge_image_url, detail_banner_image_url, buttons[], webview_link, status 코드값 |
| `GET /benefit/coupons/list` | 2026-04-01 | discount_type:"AMOUNT", 모든 timestamp 초단위, received 필드 없음 |
| `POST /auth/sessions/temporary` | 2026-04-01 | 토큰 발급 정상 |

---

## 완료된 Phase 요약

| Phase | 내용 | 테스트 | 상태 |
|-------|------|--------|------|
| Phase 1 | 인증/회원 + 로그인 상태 관리 | 38 cases | 완료 |
| Phase 2 | 마이페이지/회원관리/찜/쿠폰/마일리지 API | 16 cases | 완료 |
| Phase 3 | 소통/CS API | 10 cases | 완료 |
| Phase 4 | 부가 콘텐츠/설정 API | 8 cases | 완료 |
| Phase 5 | Mock → API 전환 | 5 cases | 완료 |
| Phase 7 | 마이페이지 API 연동 강화 | — | 완료 (P7-6 보류) |
| Phase 8 | UI/UX 개선 | — | 완료 |
| Phase 9 | 성능/품질 | — | 완료 |
| Phase 10 | API 실제 응답 기반 재설계 | 42 cases | 완료 |
| **합계** | | **133 tests** | |
