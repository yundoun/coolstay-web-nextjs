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
- [x] `P11C-1` 로그인 응답 검증 → user에 name/history_yn 없음, AuthUser 수정
- [x] `P11C-2` /auth/code/send → sms_auth_key 반환 확인
- [ ] `P11C-3` /auth/code/check — 미호출 (인증 코드 필요)
- [x] `P11C-4` /auth/code/list → auth_method 구조 확인
- [ ] `P11C-5~9` register/find/sns — 소셜 로그인 보류 (Phase 6)

#### 마이페이지 (4개)
- [x] `P11C-10` mypage/list → new_alarm/notice_date number(초) 확인, 타입 수정
- [x] `P11C-11` users/update → token+user 반환 확인
- [x] `P11C-12` pw/check → 호출 확인 (enc_password 형식 검증 필요)
- [ ] `P11C-13` users/delete — 미호출 (계정 삭제)

#### 찜 (3개)
- [x] `P11C-14` ST006 찜 목록 → motels[] + rating/download_coupon_info 확인, StoreItem 보강
- [x] `P11C-15` dibs/register → storeKey(camelCase) 확인
- [x] `P11C-16` dibs/delete → 파라미터 에러 (flag 조합 확인 필요)

#### 마일리지 (2개)
- [x] `P11C-17` mileage/list → store_key 필수, points[] 반환
- [ ] `P11C-18` mileage/delete — 미호출

### Phase 11-D — CS/설정/기타 `branch: feat/phase11d-verify-cs`

> 알림/공지/FAQ/문의 + 설정/약관/친구추천 (11개 엔드포인트)

#### 알림 (3개)
- [x] `P11D-1` alarms/list → link 객체, alarm_categories 발견, Alarm 타입 수정
- [ ] `P11D-2` alarms/card/update — 미호출
- [ ] `P11D-3` alarms/delete — 미호출

#### 게시판 (3개)
- [x] `P11D-4` NOTICE → key/view_count/title/reg_dt만 반환 (description 없음)
- [x] `P11D-5` FAQ → type에 카테고리명("마일리지") 포함
- [ ] `P11D-6` INQUIRY → 에러 (board_type=ASK일 가능성)

#### 설정 (2개)
- [x] `P11D-7` settings/list → 코드 US002/US003/US007, 컴포넌트 수정
- [ ] `P11D-8` settings/update — 미호출

#### 약관 (1개)
- [x] `P11D-9` terms/list → 기존 타입과 일치 ✅

#### 친구추천 (2개)
- [x] `P11D-10` friend/list → button 구조 변경, update_dt number, Friend 타입 수정
- [ ] `P11D-11` friend/register — 미호출

---

## Phase 12 — API 필드 100% 활용 UI 재구성

> 검증된 API 응답의 모든 의미있는 필드를 UI에 반영한다.
> 내부/시스템 필드(filter_bit, area_cd 등)는 제외.

### Phase 12-A — 숙소 상세 (활용률 32%→90%) `branch: feat/phase12a-accommodation-detail`

> motel 37개 필드 중 12개만 사용 중. 가장 개선 효과가 큰 페이지.

#### 혜택/쿠폰 섹션
- [ ] `P12A-1` `motel.coupons[]` — 숙소 전용 쿠폰 목록 섹션 추가 (다운로드 가능 쿠폰 표시)
- [ ] `P12A-2` `motel.benefits[]` — 혜택 배너/뱃지 섹션 (무한혜택, 선물혜택 등)
- [ ] `P12A-3` `motel.benefit_point_rate` — 마일리지 적립률 뱃지 ("최대 N% 적립")
- [ ] `P12A-4` `motel.v2_support_flag` — 지원 기능 뱃지 (첫 예약 할인, 최저가 보장 등)

#### 부가 정보 섹션
- [ ] `P12A-5` `motel.extra_services[]` — 유료 서비스 목록 (조식, 바비큐, 픽업 등)
- [ ] `P12A-6` `motel.external_events[]` — 외부 이벤트/프로모션 배너
- [ ] `P12A-7` `motel.event` — 숙소 자체 이벤트 배너
- [ ] `P12A-8` `motel.consecutive_yn` + `cool_consecutive_popup` — 연박 할인 안내 뱃지/팝업

#### 운영 정보 강화
- [ ] `P12A-9` `motel.business_info` — 사업자 정보 섹션 (하단 접이식)
- [ ] `P12A-10` `motel.phone_number` + `safe_number` — 전화 문의 버튼 (안심번호 우선)
- [ ] `P12A-11` `motel.parking_yn` + `parking_count` + `parking_full_yn` + `parking_info` — 주차 정보 통합 표시
- [ ] `P12A-12` `motel.site_payment_yn` — 현장결제 가능 뱃지

#### 객실 상세 강화
- [ ] `P12A-13` `items[].sub_items[].daily_extras[]` — 시간대별 재고/가격 표시 (대실 시간 선택)
- [ ] `P12A-14` `items[].sub_items[].extras[]` — 객실 부가 옵션 표시
- [ ] `P12A-15` `motel.v2_external_links[]` — 외부 예약 사이트 링크 (야놀자, 여기어때 등)

### Phase 12-B — 검색/찜 카드 강화 (활용률 35%→80%) `branch: feat/phase12b-search-cards`

> 검색 결과/찜 목록 카드에 정보가 부족. StoreItem 필드 활용 극대화.

#### 공통 숙소 카드 컴포넌트
- [ ] `P12B-1` `StoreItem.rating` — 평점 + 리뷰 수 표시 (⭐ 4.3 (20))
- [ ] `P12B-2` `StoreItem.parking_yn` — 주차 가능 아이콘/뱃지
- [ ] `P12B-3` `StoreItem.consecutive_yn` — 연박 할인 뱃지
- [ ] `P12B-4` `StoreItem.extra_services[]` — 서비스 태그 (조식, 수영장 등)
- [ ] `P12B-5` `StoreItem.benefit_point_rate` — 마일리지 적립률 표시
- [ ] `P12B-6` `StoreItem.download_coupon_info` — 다운로드 쿠폰 뱃지 (status !== "NON_TARGET" 시)

#### 검색 전용
- [ ] `P12B-7` `StoreItem.distance` — 거리 표시 (위치 검색 시)
- [ ] `P12B-8` `StoreItem.location.address` — 간략 주소 표시

#### 찜 목록 전용
- [ ] `P12B-9` 찜 WishlistCard에 위 공통 카드 컴포넌트 적용
- [ ] `P12B-10` `StoreItem.location` — 지도 아이콘 + 주소 표시

### Phase 12-C — 홈 화면 완성 (활용률 40%→90%) `branch: feat/phase12c-home`

> 홈 API 반환 필드 대부분 미사용. 배너 링크, 추천 숙소 정보 강화.

#### 배너
- [ ] `P12C-1` `banners[].link` — 배너 클릭 시 link.target으로 네비게이션 (현재 미동작)
- [ ] `P12C-2` `banners[].link.btn_name` — CTA 버튼 텍스트 오버레이

#### 추천 숙소 카드
- [ ] `P12C-3` `recommend_stores[].rating` — 평점 표시
- [ ] `P12C-4` `recommend_stores[].parking_yn` — 주차 뱃지
- [ ] `P12C-5` `recommend_stores[].benefit_point_rate` — 적립률 뱃지
- [ ] `P12C-6` `recommend_stores[].extra_services[]` — 서비스 태그
- [ ] `P12C-7` `recommend_stores[].consecutive_yn` — 연박 뱃지

#### 기획전 섹션
- [ ] `P12C-8` `exhibitions[].thumb_description` — 부제 텍스트 (현재 HTML description 노출 수정됨)

### Phase 12-D — 예약/리뷰/쿠폰 상세 (활용률 55%→90%) `branch: feat/phase12d-booking-review`

#### 예약 상세
- [ ] `P12D-1` `book.refund_policies[]` — 환불 규정 테이블 (기한, 비율%, 금액)
- [ ] `P12D-2` `book.payment.status` — 결제 상태 뱃지 (PS003 등 → "결제완료"/"환불" 매핑)
- [ ] `P12D-3` `book.motel.location.address` — 숙소 주소 표시 + 지도 링크
- [ ] `P12D-4` `book.safe_number` — 안심번호로 전화 버튼
- [ ] `P12D-5` `book.items[].category` — 객실 카테고리 뱃지 (대실/숙박)
- [ ] `P12D-6` `book.vehicle_yn` — 차량 이용 여부 표시
- [ ] `P12D-7` `book.partial_cancel_yn` + `partial_refund_yn` — 부분 취소/환불 상태 표시
- [ ] `P12D-8` `book.discount_price` vs `origin_price_total` — 할인 전/후 가격 비교 표시

#### 리뷰
- [ ] `P12D-9` `review.best_yn` — "베스트 리뷰" 뱃지 ("Y" 시 강조)
- [ ] `P12D-10` `review.user.name` — 작성자 이름 표시
- [ ] `P12D-11` `review.status_info.start_date` — 이용일 표시 ("2026.03.31 이용")
- [ ] `P12D-12` `review.motel.images[0]` — 숙소 대표 이미지 썸네일

#### 쿠폰 상세
- [ ] `P12D-13` `coupon.day_codes[]` — 사용 가능 요일 표시 (월~일)
- [ ] `P12D-14` `coupon.usable_start_dt` / `usable_end_dt` — 사용 가능 기간 (등록 기간과 구분)
- [ ] `P12D-15` `coupon.enterable_start_dt` / `enterable_end_dt` — 입실 가능 기간
- [ ] `P12D-16` `coupon.type` + `sub_category_code` — 쿠폰 유형 뱃지 (PACKAGE, AUTO 등)

### Phase 12-E — 마이페이지/알림/마일리지 (활용률 50%→90%) `branch: feat/phase12e-mypage-alarm`

#### 마이페이지
- [ ] `P12E-1` `info.new_alarm_date` — 알림 메뉴에 "NEW" 뱃지 (최근 알림 존재 시)
- [ ] `P12E-2` `info.new_notice_date` — 공지 메뉴에 "NEW" 뱃지
- [ ] `P12E-3` `info.reservation_count` — 예약 카운트 뱃지 강화

#### 알림
- [ ] `P12E-4` `alarm.link.btn_name` — CTA 버튼 텍스트 표시 (현재 link.target만 사용)
- [ ] `P12E-5` `alarm_categories[]` — 카테고리 필터 탭 (전체/예약/혜택/알림 등)
- [ ] `P12E-6` `alarm.description` — 상세 설명 표시 (접이식)

#### 마일리지
- [ ] `P12E-7` `points[].reason` — 적립/사용 사유 텍스트 표시
- [ ] `P12E-8` `points[].remained_point` — 거래 후 잔액 표시

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
