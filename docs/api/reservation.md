# Reservation API 명세서 — 예약 (Phase 4)

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)
> 최종 업데이트: 2026-04-01

---

## 예약 플로우 개요

```
1. GET  /reserv/users/payments/list   — 결제 수단 조회 + 노쇼/현장결제 확인
2. POST /reserv/ready                  — 예약 준비 (검증 + book_id 발급)
3. (PG 결제 모듈 연동)                  — 온라인 결제 시만
4. POST /reserv/register               — 예약 확정 (PG 결제 완료 후)
5. GET  /reserv/users/list             — 예약 목록 조회
6. POST /reserv/delete                 — 예약 취소
```

### 결제 수단별 플로우

| 결제 수단 | 플로우 | register 호출 |
|-----------|--------|:------------:|
| 현장결제 (`SITE`) | `ready` → 즉시 예약 완료 | X |
| 0원 결제 | `ready` → 즉시 예약 완료 | X |
| 온라인 결제 (카드 등) | `ready` → PG SDK → `register` | O |

---

## 핵심 개념: item 구조

숙소 상세 API(`/contents/details/list`) 응답 구조:

```
motel (숙소)
├── items[] (객실 = item)
│   ├── key: "D_KCSI_xxx"          ← 객실 키
│   ├── name: "스탠다드"
│   └── sub_items[] (패키지 = package)
│       ├── key: "D_KCIP_xxx"      ← 패키지 키 ★ 예약 시 item_key로 사용
│       ├── category.code: "010101" (대실) / "010102" (숙박)
│       ├── price / discount_price
│       └── daily_extras[]          ← 일별 시간/재고 정보
│           └── extras[]
│               ├── STIME: "10"     ← 시작 가능 시간
│               ├── ETIME: "23"     ← 종료 시간
│               ├── UTIME: "3"     ← 대실 이용 시간 (대실만)
│               ├── PRICE: "25000"
│               ├── SALES_YN: "Y"
│               └── TOTAL_AMOUNT / SALES_AMOUNT (재고)
```

> **주의**: 예약 API의 `item_key`에는 **패키지(sub_item) 키**를 전달해야 한다. 객실(item) 키가 아님.

---

## 1. GET /reserv/users/payments/list — 회원 결제 정보 조회

예약 페이지 진입 시 결제 수단, 현장결제 가능 여부, 노쇼 차단 여부를 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `phone_number` | string | O | 사용자 전화번호 (하이픈 제거) |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `site_payment_usage_cnt` | number | 현장결제 사용 횟수 |
| `site_payment_base_cnt` | number | 현장결제 최대 이용 횟수 (기본 20) |
| `noshow_base_time` | string | 노쇼 기준 시간 (예: `"22"`) |
| `noshow_block_yn` | string | 노쇼 차단 여부 (`Y`/`N`) |
| `payment_methods` | PaymentMethod[] | 사용 가능 결제 수단 목록 |

#### PaymentMethod

| 필드 | 타입 | 설명 |
|------|------|------|
| `pg_code` | string? | PG사 코드 (현장결제 시 없음). 예: `"INICIS_DIR"`, `"TOSS"`, `"INICIS_NON_CERT"` |
| `method` | string | 결제 방식 코드. 예: `"SITE"`, `"CARD"`, `"KAKAOPAY"`, `"TOSSPAY"`, `"NPAY"`, `"PHONE"` |
| `available_yn` | string | 사용 가능 여부 (`Y`/`N`) |
| `guide_message` | string | 결제 수단 표시명. 예: `"현장결제"`, `"신용/체크카드"`, `"카카오페이"` |

### 웹 사용처

Hook: `usePaymentInfo` — 예약 페이지 결제 수단 선택, 현장결제 가능 여부 표시
현재 미연동 (PG SDK 필요)

---

## 2. POST /reserv/ready — 예약 준비

예약 정보를 검증하고 임시 주문(book_id)을 생성한다. 서버에서 가격, 재고, 쿠폰/마일리지를 검증한다.

### Request Body

| 필드 | 타입 | 필수 | 설명 | 실제값 예시 |
|------|------|:----:|------|------------|
| `motel_key` | string | O | 숙소 유니크키 | `"D_KCST_20250619..."` |
| `item_key` | string | O | **패키지(sub_item) 키** ★ 객실 키가 아님 | `"D_KCIP_20250623..."` |
| `item_type` | string | O | 카테고리 코드 | `"010101"` (대실) / `"010102"` (숙박) |
| `book_start_dt` | string | O | 체크인 일시 | `"20260327170000"` (yyyyMMddHHmmss) |
| `book_end_dt` | string | O | 체크아웃 일시 | `"20260328130000"` (yyyyMMddHHmmss) |
| `book_user_name` | string | O | 예약자 이름 | `"홍길동"` |
| `book_user_number` | string | O | 예약자 전화번호 (하이픈 제거) | `"01012345678"` |
| `sms_auth_key` | string | - | SMS 인증 키 (비회원) | |
| `sms_auth_code` | string | - | SMS 인증 코드 (비회원) | |
| `vehicle_yn` | string | O | 차량 여부 | `"Y"` / `"N"` |
| `price` | number | O | 기준 가격 (원가) | `50000` |
| `discount_price` | number | O | 판매 가격 (프로모션 적용) | `45000` |
| `total_price` | number | O | 최종 결제 가격 (마일리지 차감 후) | `42000` |
| `coupons` | CouponItem[] | - | 사용 쿠폰 목록 | |
| `benefit_mileage_rate` | number | O | 마일리지 적립률 | `4` (= 4%) |
| `mileage` | number | - | 사용 마일리지 | `3000` |
| `payment_pg` | string | - | PG사 코드 (현장결제 시 빈값) | `""` / `"INICIS"` |
| `payment_method` | string | O | 결제 수단 코드 | `"SITE"` / `"CARD"` |

#### item_type 코드

| 코드 | 설명 |
|------|------|
| `010101` | 대실 |
| `010102` | 숙박 |

> `"RENT"`, `"STAY"` 등 문자열은 서버가 인식하지 못함. 반드시 카테고리 코드 사용.

#### 체크인/체크아웃 시간 계산

시간 정보는 숙소 상세 API → sub_item → `daily_extras`에서 추출:

| 유형 | book_start_dt | book_end_dt |
|------|---------------|-------------|
| **대실** | 오늘 + `STIME`(또는 사용자 선택 시간) | 오늘 + 선택 시간 + `UTIME` |
| **숙박** | 오늘 + `STIME` | 내일 + `ETIME` |

예시 (대실, STIME=10, UTIME=3, 사용자 12시 선택):
- `book_start_dt`: `"20260327120000"`
- `book_end_dt`: `"20260327150000"`

예시 (숙박, STIME=17, ETIME=13):
- `book_start_dt`: `"20260327170000"`
- `book_end_dt`: `"20260328130000"`

#### payment_pg 코드 (AOS 기준)

| 코드 | 설명 |
|------|------|
| `""` (빈값) | 현장결제 |
| `"INICIS"` | 이니시스 웹 표준결제 |
| `"TOSS_PAYMENTS"` | 토스 페이먼츠 |
| `"TOSS_PAY"` | 토스페이 |
| `"TOSS"` | 토스 |

> `"IAMPORT"`는 유효한 PG 코드가 아님. 아임포트는 PG 래퍼이며, 서버는 실제 PG사 코드를 기대함.

#### payment_method 코드 (AOS 기준)

| 코드 | 설명 |
|------|------|
| `"SITE"` | 현장결제 |
| `"CARD"` | 신용카드 |
| `"TRANS"` | 실시간 계좌이체 |
| `"PHONE"` | 핸드폰 소액결제 |
| `"KAKAOPAY"` | 카카오페이 |
| `"NPAY"` | 네이버페이 |
| `"TOSSPAY"` | 토스 결제 |

#### CouponItem (coupons 배열 아이템)

| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | string | 쿠폰 코드 |
| `title` | string | 쿠폰명 |
| `description` | string | 쿠폰 설명 |
| `category_code` | string | 카테고리 코드 (`STEP2` 등) |
| `category_description` | string | 카테고리 설명 |
| `type` | string | 쿠폰 타입 (`SINGLE` 등) |
| `discount_type` | string | 할인 유형 (`AMOUNT` / `RATE`) |
| `discount_amount` | number | 할인 금액 또는 할인율 |
| `total_amount` | number | 총 수량 |
| `remain_amount` | number | 잔여 수량 |
| `dup_use_yn` | string | 중복 사용 가능 여부 (`Y`/`N`) |
| `usable_yn` | string | 사용 가능 여부 (`Y`/`N`) |
| `status` | string | 상태 (`C001` 등) |
| `start_dt` | number | 시작일 (Unix timestamp) |
| `end_dt` | number | 종료일 (Unix timestamp) |
| `usable_start_dt` | number | 사용 가능 시작일 (Unix timestamp) |
| `usable_end_dt` | number | 사용 가능 종료일 (Unix timestamp) |
| `day_codes` | string[] | 사용 가능 요일 코드 |
| `constraints` | object[] | 사용 제약 조건 (`{ code, value, description }`) |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `book_id` | string | 주문 식별 키 (이후 register에서 `merchant_uid`로 사용) |
| `status` | string | 예약 상태 |
| `pull` | object | 이벤트 팝업 정보 (웹에서는 무시 가능) |

### 에러 코드 (연동 중 확인)

| 코드 | desc | 원인 |
|------|------|------|
| `40000029` | 대실 체크인 시간 변경됨 | book_start/end_dt가 패키지 시간과 불일치 |
| `50000000` | 내부서버 오류 (레거시 코드) | item_type에 잘못된 값 (`"STAY"` 등) |
| `50000000` | 존재하지 않는 코드 | payment_pg/method 조합이 서버에 등록되지 않음 |
| `50030001` | 상점 서비스 내부 에러 | item_key가 패키지 키가 아닌 객실 키일 때 |

### 비즈니스 로직

- 서버에서 체크인 날짜 >= 현재 날짜 검증 (익일 03시까지는 전날로 계산)
- 가격 검증: 기준가 vs 판매가 vs 최종결제가
- 재고 검증: 해당 날짜 객실 인벤토리 확인
- 쿠폰/마일리지 유효성 검증
- 현장결제: `payment_pg` 빈값 + `payment_method` = `"SITE"` → 즉시 예약 확정

### 웹 사용처

Hook: `useBookingSubmit` — 예약 페이지 "결제하기" 버튼 클릭 시 호출
현재 상태: 현장결제(SITE)만 지원 (PG SDK 미연동)

---

## 3. POST /reserv/register — 예약 확정

PG 결제 완료 후 최종 예약을 확정한다. `ready`에서 받은 `book_id`를 `merchant_uid`로 전달한다.

> 현장결제(SITE) / 0원 결제 시에는 호출하지 않음.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `payment_pg` | string | - | PG사 코드 (`"INICIS"`, `"TOSS_PAYMENTS"` 등) |
| `payment_method` | string | - | 결제 수단 (`"CARD"`, `"TRANS"` 등) |
| `payment_imp_uid` | string | - | 아임포트 결제 고유번호 |
| `merchant_uid` | string | O | 상점 고유번호 (= `book_id`) |
| `item_name` | string | - | 결제 상품명 |
| `price` | number | - | 최종 결제 금액 |
| `name` | string | - | 예약자 이름 |
| `email` | string | - | 예약자 이메일 |
| `phone_number` | string | - | 예약자 전화번호 |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `pull` | object | 이벤트 팝업 정보 |

### 웹 사용처

PG SDK 연동 후: PG 결제 콜백 → `register` 호출 → 예약 완료 페이지 이동
현재 상태: 미사용 (현장결제만 지원)

---

## 4. GET /reserv/users/list — 회원 예약 목록 조회

회원의 예약/이용 내역을 페이징 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `search_type` | string | O | `ST101` (목록) / `ST102` (상세, search_extra에 bookId) |
| `search_extra` | string | - | 검색 대상 키 (ST102 시 bookId) |
| `reserve_type` | string | - | 예약 필터 (아래 참조) |
| `count` | number | - | 페이지당 개수 (기본 10~20) |
| `cursor` | string | - | 페이징 커서 |

#### reserve_type 필터

| 값 | 설명 | 서버 조건 |
|----|------|-----------|
| `BEFORE` | 이용 전 | BookStatus=READY + OrderStatus=CONFIRM |
| `AFTER` | 이용 완료 | BookStatus=USE + OrderStatus=CONFIRM |
| `CANCEL` | 취소됨 | OrderStatus=REFUND |
| (미전송) | 전체 | 전체 조회 |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalCount` | number | 전체 예약 수 |
| `nextCursor` | string? | 다음 페이지 커서 |
| `books` | BookItem[] | 예약 목록 |

#### BookItem

| 필드 | 타입 | 설명 |
|------|------|------|
| `bookId` | string | 예약 유니크키 |
| `name` | string | 예약자 이름 |
| `phoneNumber` | string | 예약자 전화번호 |
| `safeNumber` | string? | 안심번호 |
| `startDt` | number | 체크인 일시 (Unix timestamp) |
| `endDt` | number | 체크아웃 일시 (Unix timestamp) |
| `regDt` | number | 예약 등록 일시 (Unix timestamp) |
| `vehicleYn` | string | 차량 여부 (`Y`/`N`) |
| `status` | string | 예약 상태 (`CONFIRMED`, `CANCELED` 등) |
| `partialCancelYn` | string? | 부분 취소 여부 |
| `receiptYn` | string? | 영수증 발급 여부 |
| `refundYn` | string? | 취소 가능 여부 (`Y`/`N`) |
| `originPriceTotal` | number | 기본 가격 총합 |
| `discountPriceTotal` | number | 판매가 총합 |
| `discountPrice` | number | 판매가 (부분취소 반영) |
| `totalPrice` | number | 최종 결제 가격 |
| `usedPoint` | number | 사용 마일리지 |
| `refundPoint` | number | 환불 마일리지 |
| `motel` | MotelSimple | 숙소 정보 |
| `rooms` | ItemSimple[] | 객실 정보 목록 |
| `itemImages` | ImageItem[] | 객실 이미지 |
| `usedCoupons` | CouponItem[]? | 사용한 쿠폰 |
| `payment` | PaymentSimple? | 결제 정보 |
| `review` | ReviewItem? | 리뷰 정보 |
| `refundPolicy` | RefundPolicyItem[]? | 취소 규정 |

#### MotelSimple

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 숙소 키 |
| `name` | string | 숙소명 |
| `phoneNumber` | string | 전화번호 |
| `safeNumber` | string | 안심번호 |
| `partnershipType` | string | 제휴 유형 |
| `businessType` | string | 업종 |
| `location` | Location | 위치 정보 |
| `images` | ImageItem[] | 이미지 |

#### ItemSimple

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 객실 키 |
| `name` | string | 객실명 |
| `category` | string | 카테고리 (`010101`/`010102`) |

#### PaymentSimple

| 필드 | 타입 | 설명 |
|------|------|------|
| `pg` | string | PG사 코드 |
| `method` | string | 결제 수단 코드 |
| `impUid` | string? | 아임포트 UID |
| `cardName` | string? | 카드사명 |

#### RefundPolicyItem

| 필드 | 타입 | 설명 |
|------|------|------|
| `until` | string | 취소 기한 |
| `refundRate` | number | 환불율 (0~100%) |

### 웹 사용처

Hook: `useBookingList` — 마이페이지 예약 내역 (탭별 필터)
Hook: `useBookingDetail` — 예약 상세 (search_type=ST102)

---

## 5. GET /reserv/users/upcoming — 다가오는 예약 조회

홈 화면 하단 예약 확인 팝업용. 가장 빠른 입실일 예약 1건 조회.

### Query Parameters

없음 (인증 토큰으로 사용자 식별)

### Response (`result`)

`/reserv/users/list` 와 동일한 구조. `books` 배열에 1건만 포함.

### 웹 사용처

Hook: `useUpcomingBooking` — 홈 화면 다가오는 예약 배너

---

## 6. POST /reserv/delete — 예약 취소

예약을 취소하고 환불을 처리한다. 환불 정책에 따라 환불율이 자동 적용된다.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `book_id` | string | O | 예약 유니크키 |

### Response

성공 시 빈 result 반환.

### 에러 코드

| 코드 | 설명 |
|------|------|
| `ERR_CANCEL_BOOKING_INVALID_TIME` | 취소 불가능한 시간 |
| `ERR_CANCEL_BOOKING_FAIL_40000036` | 취소 실패 |

### 비즈니스 로직

- 서버에서 환불 정책 기반 환불율 자동 계산
- 쿠폰 복구, 마일리지 복구 처리
- 객실 재고 복구

### 웹 사용처

예약 상세 페이지 "예약 취소" 버튼 → `useBookingDetail.cancel()`

---

## 7. GET /reserv/guest/list — 비회원 예약 조회

비회원이 예약번호 + 전화번호로 예약 상세를 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `book_id` | string | O | 예약 유니크키 |
| `phone_number` | string | O | 예약자 전화번호 |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `book` | BookItem | 예약 상세 (위 BookItem 참조) |

### 웹 사용처

비회원 예약 조회 페이지 (미구현)

---

## 8. POST /reserv/users/delete — 예약 내역 삭제 (숨김)

예약 내역을 목록에서 숨긴다 (물리 삭제 아님).

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `book_id` | string | 조건 | 예약 ID (flag=`I` 시 필수) |
| `flag` | string | O | `I`: 개별 삭제, `A`: 전체 삭제 |

### Response

성공 시 빈 result 반환.

### 웹 사용처

예약 상세 페이지 "삭제" 버튼 → `useBookingDetail.hide()`

---

## 9. GET /reserv/receipt — 영수증 조회

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `identifyKey` | string | O | 예약번호 (book_id) |

### Response

영수증 웹 페이지 URL 반환.

---

## 웹 연동 현황

### API 함수 (`src/domains/booking/api/reservationApi.ts`)

| 함수 | 엔드포인트 | 연동 상태 |
|------|-----------|:---------:|
| `getUserPaymentInfo(phone)` | GET /reserv/users/payments/list | 미사용 (PG 필요) |
| `prepareBooking(body)` | POST /reserv/ready | ✅ 연동 완료 |
| `confirmBooking(body)` | POST /reserv/register | 미사용 (PG 필요) |
| `getBookingList(params)` | GET /reserv/users/list | ✅ 연동 완료 |
| `getUpcomingBooking()` | GET /reserv/users/upcoming | ✅ 함수 생성 |
| `getGuestBooking(id, phone)` | GET /reserv/guest/list | ✅ 함수 생성 |
| `cancelBooking(bookId)` | POST /reserv/delete | ✅ 연동 완료 |
| `hideBooking(bookId, flag)` | POST /reserv/users/delete | ✅ 연동 완료 |
| `getReceiptUrl(bookId)` | GET /reserv/receipt | ✅ 함수 생성 |

### Hooks

| Hook | 용도 | 사용 컴포넌트 |
|------|------|--------------|
| `useBookingSubmit` | 예약 생성 (ready→register) | BookingPageLayout |
| `useBookingList` | 예약 목록 (cursor 페이징) | BookingHistoryPage |
| `useBookingDetail` | 예약 상세 + 취소 + 삭제 | BookingDetailPage |

### 웹 폼 → API 요청 매핑

| 웹 (useBookingForm) | API (ready body) | 비고 |
|----------------------|------------------|------|
| `context.accommodation.id` | `motel_key` | |
| `context.room.packageKey` | `item_key` | ★ 패키지 키 (sub_item.key) |
| `context.bookingType` | `item_type` | `"rental"` → `"010101"` / `"stay"` → `"010102"` |
| `context.startHour` + 선택시간 | `book_start_dt` | daily_extras STIME 기반, `yyyyMMddHHmmss` |
| `context.endHour` / `useHours` | `book_end_dt` | 숙박: 다음날 ETIME / 대실: 시작+UTIME |
| `bookerInfo.name` | `book_user_name` | |
| `bookerInfo.phone` | `book_user_number` | 하이픈 제거 |
| `hasVehicle` | `vehicle_yn` | `true` → `"Y"` / `false` → `"N"` |
| `context.originalPrice` | `price` | 원가 |
| `context.price` | `discount_price` | 판매가 |
| `paymentSummary.totalAmount` | `total_price` | 최종 결제가 (마일리지 차감) |
| `context.benefitPointRate` | `benefit_mileage_rate` | |
| `mileageUsed` | `mileage` | |
| (현장결제 고정) | `payment_pg` = `""`, `payment_method` = `"SITE"` | PG 연동 전 |

### TODO: PG SDK 연동

온라인 결제를 지원하려면:
1. `/reserv/users/payments/list`로 사용 가능한 PG/method 조회
2. PG SDK(포트원/아임포트) 연동 → `payment_imp_uid` 획득
3. `POST /reserv/register`로 예약 확정
4. `PaymentMethodSelector`에서 카드/계좌이체/휴대폰 결제 활성화
