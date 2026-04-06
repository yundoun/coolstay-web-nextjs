# CoolStay Web — 작업 태스크

---

## 이벤트 영역 디자인 & UX 개선 `branch: feat/event-ui-improvement`

> **진행률**: 92 / 117 (78%)

### 태스크

- [x] `EV-1` 현행 UX 분석 — dev 서버 실행 + Playwright로 현재 화면 캡처 + 실제 데이터 기반 문제 식별
- [x] `EV-2` 홈 EventSection 재설계 — 분석 결과 기반 카드/레이아웃/인터랙션 개선
- [x] `EV-3` EventListPage 재설계 — 필터/카드/플로우 개선
- [x] `EV-4` EventDetailPage 재설계 — 히어로/콘텐츠/갤러리/CTA 개선
- [x] `EV-5` 테스트 전체 통과 확인 + 최종 스크린샷 비교 ✅ 129 tests passed

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

### Phase 12-A — 숙소 상세 ✅ `branch: feat/phase12a-accommodation-detail`

> 타입 15개 필드 추가 + mapMotelToDetail 전체 매핑 + 신규 컴포넌트 5개

#### 혜택/쿠폰 섹션
- [x] `P12A-1` `motel.coupons[]` — BenefitSection에서 쿠폰 다운로드 뱃지 표시
- [x] `P12A-2` `motel.benefits[]` — BenefitSection 혜택 카드 (이미지 + 설명)
- [x] `P12A-3` `motel.benefit_point_rate` — BenefitSection "+N% 적립" 뱃지
- [x] `P12A-4` `motel.v2_support_flag` — BenefitSection 지원 기능 뱃지

#### 부가 정보 섹션
- [x] `P12A-5` `motel.extra_services[]` — ExtraServiceSection 서비스 그리드
- [x] `P12A-6` `motel.external_events[]` — mapMotelToDetail에서 events 매핑
- [x] `P12A-7` `motel.event` — mapMotelToDetail에서 events 매핑
- [x] `P12A-8` `motel.consecutive_yn` — BenefitSection 연박 뱃지

#### 운영 정보 강화
- [x] `P12A-9` `motel.business_info` — BusinessInfoSection (접이식)
- [x] `P12A-10` `motel.phone_number` + `safe_number` — BusinessInfoSection 전화 버튼
- [x] `P12A-11` 주차 정보 — ParkingInfoCard
- [x] `P12A-12` `motel.site_payment_yn` — ExtraServiceSection "현장결제 가능" 뱃지

#### 객실 상세 강화
- [x] `P12A-13` `items[].sub_items[].daily_extras[]` — mapMotelToDetail에서 매핑
- [x] `P12A-14` `items[].sub_items[].extras[]` — mapMotelToDetail에서 매핑
- [x] `P12A-15` `motel.v2_external_links[]` — ExternalLinkSection (야놀자, 여기어때)

### Phase 12-B — 검색/찜 카드 ✅ `branch: feat/phase12b-search-cards`

> AccommodationCard + mapStoreToAccommodation + WishlistCard 강화

#### 공통 숙소 카드 컴포넌트
- [x] `P12B-1` `StoreItem.rating` — ⭐ 평점 + (리뷰 수)
- [x] `P12B-2` `StoreItem.parking_yn` — 태그로 표시 ("주차가능")
- [x] `P12B-3` `StoreItem.consecutive_yn` — 태그로 표시 ("연박")
- [x] `P12B-4` `StoreItem.extra_services[]` — 서비스 태그
- [x] `P12B-5` `StoreItem.benefit_point_rate` — "+N% 적립" 표시
- [x] `P12B-6` `StoreItem.download_coupon_info` — 쿠폰 뱃지

#### 검색 전용
- [x] `P12B-7` `StoreItem.distance` — location에 거리 표시
- [x] `P12B-8` `StoreItem.location.address` — 주소 표시

#### 찜 목록 전용
- [x] `P12B-9` WishlistCard에 평점/마일리지/쿠폰 뱃지 추가
- [x] `P12B-10` `StoreItem.location` — 주소 표시

### Phase 12-C — 홈 화면 ✅ `branch: feat/phase12c-home`

> 배너 링크 + 추천 숙소 정보 강화 + 이벤트 섹션 추가

#### 배너
- [x] `P12C-1` `banners[].link` — resolveBannerLink로 네비게이션 구현
- [x] `P12C-2` `banners[].link.btn_name` — 오버레이 텍스트

#### 추천 숙소 카드
- [x] `P12C-3` `recommend_stores[].rating` — 12-B에서 통합 (mapStoreToAccommodation)
- [x] `P12C-4` `recommend_stores[].parking_yn` — 12-B에서 통합
- [x] `P12C-5` `recommend_stores[].benefit_point_rate` — 12-B에서 통합
- [x] `P12C-6` `recommend_stores[].extra_services[]` — 12-B에서 통합
- [x] `P12C-7` `recommend_stores[].consecutive_yn` — 12-B에서 통합

#### 기획전/이벤트 섹션
- [x] `P12C-8` `exhibitions[].thumb_description` — FeatureSection에서 표시
- [x] `P12C-9` 홈 이벤트 섹션 추가 — EventSection (진행중만, 최대 4개, 전체보기 링크)

### Phase 12-D — 예약/리뷰/쿠폰 ✅ `branch: feat/phase12d-booking-review`

#### 예약 상세
- [x] `P12D-1` `book.refund_policies[]` — 환불 규정 테이블
- [x] `P12D-2` `book.payment.status` — 결제 상태 뱃지 (PS001~003 매핑)
- [x] `P12D-3` `book.motel.location.address` — 주소 + MapPin
- [x] `P12D-4` `book.safe_number` — 안심번호 전화 버튼
- [x] `P12D-5` `book.items[].category` — 대실/숙박 뱃지
- [x] `P12D-6` `book.vehicle_yn` — 차량 아이콘
- [x] `P12D-7` `book.partial_cancel_yn` + `partial_refund_yn` — 상태 뱃지
- [x] `P12D-8` `book.discount_price` vs `origin_price_total` — 원가/할인가 비교

#### 리뷰
- [x] `P12D-9` `review.best_yn` — 골드 "베스트" 뱃지
- [x] `P12D-10` `review.user.name` — 작성자 이름
- [x] `P12D-11` `review.status_info.start_date` — "YYYY.MM.DD 이용"
- [x] `P12D-12` `review.motel.images[0]` — 숙소 썸네일

#### 쿠폰 상세
- [x] `P12D-13` `coupon.day_codes[]` — 요일 그룹핑 ("월~금")
- [x] `P12D-14` `coupon.usable_start_dt` / `usable_end_dt` — 사용기간
- [x] `P12D-15` `coupon.enterable_start_dt` / `enterable_end_dt` — 입실가능
- [x] `P12D-16` `coupon.type` + `sub_category_code` — 유형 뱃지

### Phase 12-E — 마이페이지/알림/마일리지 ✅ `branch: feat/phase12e-mypage-alarm`

#### 마이페이지
- [x] `P12E-1` `info.new_alarm_date` — 7일 이내 "NEW" 뱃지
- [x] `P12E-2` `info.new_notice_date` — 7일 이내 "NEW" 뱃지
- [x] `P12E-3` `info.reservation_count` — 카운트 뱃지

#### 알림
- [x] `P12E-4` `alarm.link.btn_name` — CTA 버튼 텍스트
- [x] `P12E-5` `alarm_categories[]` — 카테고리 필터 탭
- [x] `P12E-6` `alarm.description` — 접이식 상세

#### 마일리지
- [x] `P12E-7` `points[].reason` — 거래 사유
- [x] `P12E-8` `points[].remained_point` — 잔액 표시

---

## Phase 13 — 도메인별 스펙 정렬 + UI 재구성 `branch: feat/domain-spec-alignment`

> **기준**: coolstay-domain-analysis 스펙 (flow.md, nested-objects.md, ui-binding.md, v1-v2-conversion.md)
> **워크플로우**: 타입 정렬 → UI 갭 분석 → UI 구현 → 테스트 → 커밋
> **진행률**: 10 / 24 (42%)

### CONTENTS — UI 구현 (타입 정렬 완료) ✅

- [x] `CT-1` 목록 카드에 benefit_tags, grade_tags 표시 (mapStoreToAccommodation + AccommodationCard)
- [x] `CT-2` 목록 카드에 v2_support_flag 뱃지 표시 (최저가, 무제한쿠폰, 첫예약 등)
- [x] `CT-3` 목록 카드 쿠폰 할인액 구체 표시 (hasCoupon boolean → coupons[].discount_amount)
- [x] `CT-4` 상세 페이지 객실 쿠폰 표시 (sub_items.coupons[] → RoomCard)
- [x] `CT-5` 상세 페이지 객실 남은 수량 매핑 (daily_extras CUR_SALES → remainingCount)
- [x] `CT-6` 상세 페이지 객실 키워드 매핑 (items.keywords → Room.keywords)
- [x] `CT-7` 상세 페이지 보강 — 결제혜택 렌더링, 마일리지유형 분기, 찜 토글 상태

### HOME — 타입 정렬 + UI 구현 ✅

- [x] `HM-1` 타입 정렬 — HomeBanner(title, start_dt, end_dt 등), RegionCategory(thumb_url, geometry, sub_regions) 필드 확장
- [x] `HM-2` UI 갭 분석 + 구현 — 배너 기간 노출 제어, 비회원 최근 본 숙소 localStorage 연동
- [x] `HM-3` 홈 화면 데이터 바인딩 보강 — 지역 탭 썸네일, sub_items 가격 추출 대응

### MANAGE — 타입 정렬 + UI 구현

- [ ] `MG-1` 타입 정렬 (CRITICAL) — board_type "INQUIRY"→"ASK" 수정, 필드명 일관성
- [ ] `MG-2` UI 갭 분석 — 공지/FAQ/이벤트/기획전/가이드 바인딩 체크
- [ ] `MG-3` 기획전 상세 5개 API 연쇄 호출 구현 (Contents+Benefit+Manage 조합)
- [ ] `MG-4` 신규 API — 인기 검색어(/manage/popular/keyword), 파일 업로드(/manage/files/gcs), 앱 초기화(/manage/app/list)

### BENEFIT — 타입 정렬 + UI 구현

- [ ] `BF-1` 타입 정렬 — remain_7day_count 필드명, 쿠폰 검색/정렬 타입 파라미터 추가
- [ ] `BF-2` UI 갭 분석 — 쿠폰 목록/다운로드/마일리지 바인딩 체크
- [ ] `BF-3` ST602(예약용)/ST603(선착순) 쿠폰 검색 분기 + 다운로드 6가지 타입 분기
- [ ] `BF-4` 쿠폰 정렬 UI(추천순/최신순/만료임박순) + 마일리지 목록 개선

### RESERVATION — 타입 정렬 + UI 구현 (BENEFIT 이후)

- [ ] `RV-1` 타입 정렬 — 결제 상태 코드 전체 매핑, noshow 필드 추가, PaymentMethod 보강
- [ ] `RV-2` UI 갭 분석 — 예약 플로우 전체 바인딩 체크 (가격/쿠폰/결제/환불)
- [ ] `RV-3` 가격 계산 로직 수정 — 정률 쿠폰 1일차 적용, CC009 상한, STEP1~3 다중 쿠폰
- [ ] `RV-4` UI 구현 — 현장결제 제약 표시, 환불정책 연동, PG 결제 준비, 부분 취소

### AUTH — 타입 정렬 + 신규 페이지 구현 (CONTENTS 이후)

- [ ] `AU-1` 타입 정렬 — AuthUser(phone_number null, history_yn), CodeCheckResponse snake_case
- [ ] `AU-2` UI 갭 분석 — 마이페이지/설정/알림/찜 바인딩 체크
- [ ] `AU-3` 신규 페이지 — 마이페이지 대시보드 + 회원정보 변경 + 알림센터
- [ ] `AU-4` 기능 구현 — 찜 API 연동 + 사용자 설정 + 회원탈퇴 + SNS 로그인 준비

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
| Phase 11 | API 실제 응답 전수 검증 (34/58) | — | 완료 |
| Phase 12 | API 필드 100% 활용 UI 재구성 (57개) | — | 완료 |
| **합계** | | **133 tests** | |
