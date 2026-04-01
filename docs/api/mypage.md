# MyPage / Benefit API 명세서

> **도메인**: 마이페이지, 회원관리, 찜, 쿠폰, 마일리지
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code` (사용자 세션 토큰 기반)
> **작성일**: 2026-03-31

---

## 목차

1. [마이페이지 정보 조회](#1-마이페이지-정보-조회)
2. [회원정보 변경](#2-회원정보-변경)
3. [비밀번호 확인](#3-비밀번호-확인)
4. [회원 탈퇴](#4-회원-탈퇴)
5. [찜 등록/삭제](#5-찜-등록삭제)
6. [쿠폰](#6-쿠폰)
7. [마일리지](#7-마일리지)

---

## 1. 마이페이지 정보 조회

마이페이지 상단 카운트 정보 (쿠폰 수, 마일리지, 예약 건수 등)

```
GET /auth/users/mypage/list
```

### 응답

```json
{
  "coupon_count": 3,
  "mileage_store_count": 1200,
  "reservation_count": 2,
  "new_alarm_date": "2026-03-31T00:00:00Z",
  "new_notice_date": "2026-03-31T00:00:00Z"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `coupon_count` | number | 보유 쿠폰 수 |
| `mileage_store_count` | number | 마일리지 적립 모텔 수 |
| `reservation_count` | number | 예약 건수 |
| `new_alarm_date` | string | 최신 알림 일시 |
| `new_notice_date` | string | 최신 공지사항 일시 |

### 연동 파일

- 타입: `src/domains/mypage/types/index.ts` → `MypageInfo`
- API: `src/domains/mypage/api/mypageApi.ts` → `getMypageInfo()`

---

## 2. 회원정보 변경

닉네임, 비밀번호, 전화번호 등 회원정보 변경. 변경 후 새 토큰이 발급된다.

```
POST /auth/users/update
```

### 요청

```json
{
  "name": "string",
  "nickname": "string",
  "enc_old_password": "string",
  "enc_new_password": "string",
  "phone_number": "string",
  "sms_auth_key": "XXXXX",
  "sms_auth_code": "YYYYYY"
}
```

모든 필드 선택적 — 변경할 필드만 전송.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | - | 이름 변경 |
| `nickname` | string | - | 닉네임 변경 |
| `enc_old_password` | string | - | 현재 비밀번호 (AES 암호화) |
| `enc_new_password` | string | - | 새 비밀번호 (AES 암호화) |
| `phone_number` | string | - | 전화번호 변경 |
| `sms_auth_key` | string | - | SMS 인증 키 (전화번호 변경 시) |
| `sms_auth_code` | string | - | SMS 인증 코드 (전화번호 변경 시) |

### 응답

`SessionResponse` — 새 토큰 + 유저 정보

```json
{
  "token": { "access_token": "string", "secret": "string" },
  "user": { "key": 0, "nickname": "string", ... }
}
```

### 연동 파일

- 타입: `src/domains/mypage/types/index.ts` → `UserUpdateRequest`, `UserUpdateResponse`
- API: `src/domains/mypage/api/mypageApi.ts` → `updateUser()`

> **주의**: 응답으로 받은 새 토큰으로 `setSession()` 호출 필요

---

## 3. 비밀번호 확인

회원정보 수정, 탈퇴 전 현재 비밀번호 확인

```
POST /auth/users/pw/check
```

### 요청

```json
{
  "enc_password": "AES암호화된비밀번호"
}
```

### 응답

```json
{
  "isVerified": true
}
```

### 연동 파일

- 타입: `src/domains/mypage/types/index.ts` → `PwCheckRequest`, `PwCheckResponse`
- API: `src/domains/mypage/api/mypageApi.ts` → `checkPassword()`

---

## 4. 회원 탈퇴

```
POST /auth/users/delete
```

### 요청

```json
{
  "reason_type": "NOT_USED",
  "reason_description": "사용하지 않아서"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `reason_type` | string | O | 탈퇴 사유 코드 |
| `reason_description` | string | - | 기타 사유 상세 |

### 응답

성공 시 빈 응답 (`code: "20000000"`)

### 연동 파일

- 타입: `src/domains/mypage/types/index.ts` → `UserDeleteRequest`
- API: `src/domains/mypage/api/mypageApi.ts` → `deleteUser()`

> **주의**: 탈퇴 후 `clearSession()` 호출 + 홈으로 이동 필요

---

## 5. 찜 등록/삭제

### 5-1. 찜 등록

```
POST /auth/dibs/register
```

#### 요청

```json
{
  "motel_key": "숙소키"
}
```

#### 응답

```json
{
  "storeKey": "123",
  "isLikeBenefitActive": true,
  "isFirstLikeToday": true
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `storeKey` | string | 등록된 숙소 키 |
| `isLikeBenefitActive` | boolean | 찜 혜택 활성 여부 |
| `isFirstLikeToday` | boolean | 오늘 첫 찜 여부 |

### 5-2. 찜 삭제

```
POST /auth/dibs/delete
```

#### 요청

```json
{
  "type": "0",
  "motel_keys": "123,456",
  "flag": "string"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | string | O | 삭제 유형 |
| `motel_keys` | string | O | 삭제 대상 (콤마 구분) |
| `flag` | string | - | 추가 플래그 |

### 연동 파일

- 타입: `src/domains/mypage/types/index.ts` → `DibsRegisterRequest`, `DibsDeleteRequest`
- API: `src/domains/mypage/api/mypageApi.ts` → `registerDibs()`, `deleteDibs()`

---

## 6. 쿠폰

> **Base Path**: `/benefit/coupons`
> **최종 업데이트**: 2026-04-01 (dev 서버 실제 응답 기준)

### 6-1. 쿠폰 목록 조회

```
GET /benefit/coupons/list?search_type=ST601
```

#### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `search_type` | string | O | ST601(혜택함), ST602, ST603 |
| `sort_type` | string | - | RECENT, EXPIRE, PRICE |
| `search_extra` | string | - | 검색 유형별 데이터 |
| `book_dt` | string | - | 예약일 (입실일) |
| `book_out_dt` | string | - | 퇴실일 |
| `item_category_code` | string | - | 010101(대실), 010102(숙박) |
| `discount_price` | string | - | 상품 판매가격 (ST602, ST603) |
| `first_date_discount_price` | string | - | 입실일 판매가 (ST602, ST603) |
| `cursor` | string | - | 페이지네이션 커서 |
| `count` | string | - | 요청 개수 (기본 10) |

#### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "total_count": 4,
  "remain7day_count": 4,
  "coupons": [
    {
      "coupon_pk": 20176577,
      "discount_amount": 10000,
      "total_amount": 6,
      "remain_amount": 0,
      "code": "DS1772859600614umkei",
      "title": "동촌 하야트[팩스] 재방문 쿠폰",
      "description": "동촌 하야트[팩스] 재방문 쿠폰(자동)",
      "category_code": "STEP3",
      "sub_category_code": "AUTO",
      "type": "PACKAGE",
      "discount_type": "AMOUNT",
      "dup_use_yn": "Y",
      "usable_yn": "Y",
      "status": "C001",
      "dimmed_yn": "N",
      "start_dt": 1772809200,
      "end_dt": 1775487599,
      "usable_start_dt": 1772809200,
      "usable_end_dt": 1775487599,
      "enterable_start_dt": 1772809200,
      "enterable_end_dt": 1775487599,
      "reg_dt": 1772859600,
      "day_codes": [],
      "constraints": [
        { "code": "CC004", "value": "D_KCST_...", "description": "적용제휴점" },
        { "code": "CC002", "value": "010102", "description": "숙박" },
        { "code": "CC005", "value": "ALL", "description": "주말•평일" },
        { "code": "CC001", "value": "0", "description": "최소 객실 금액(판매가) 이상" }
      ]
    }
  ]
}
```

#### 쿠폰 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `coupon_pk` | number | 쿠폰 PK |
| `discount_amount` | number | 할인 금액/비율 |
| `total_amount` | number | 총 발급 수량 |
| `remain_amount` | number | 잔여 수량 |
| `code` | string | 쿠폰 코드 |
| `title` | string | 쿠폰명 |
| `description` | string | 설명 |
| `category_code` | string | 카테고리 (`"STEP3"` 등) |
| `sub_category_code` | string | 서브 카테고리 (`"AUTO"` 등) |
| `type` | string | 타입 (`"PACKAGE"` 등) |
| `discount_type` | string | **`"AMOUNT"` (원) / `"RATE"` (%)** |
| `dup_use_yn` | string | 중복 사용 (`"Y"` / `"N"`) |
| `usable_yn` | string | 사용 가능 여부 |
| `status` | string | 상태 코드 (`"C001"` 등) |
| `dimmed_yn` | string | 비활성화 (`"Y"` = 만료/사용완료) |
| `start_dt` ~ `reg_dt` | number | **모든 타임스탬프: 초 단위** |
| `day_codes` | string[] | 요일 코드 |
| `constraints` | CouponConstraint[] | 사용 조건 배열 |

> **주의**:
> - `discount_type`은 `"AMOUNT"` (정액) / `"RATE"` (정률) — `"FIXED"` 아님
> - `received` 필드는 실제 응답에 존재하지 않음
> - 모든 타임스탬프는 **초 단위**: `new Date(value * 1000)` 변환 필요
> - `constraints[].code`는 내부 코드 (`CC001` 등) — UI에서는 `description`만 표시

### 6-2. 쿠폰 등록

```
POST /benefit/coupons/register
```

```json
{ "coupon_code": "WELCOME2026", "option_seq": 0 }
```

선착순 쿠폰: 응답에 `coupon_options`가 있으면 팝업 → 사용자 선택 후 `option_seq` 포함 재요청

### 6-3. 쿠폰 다운로드

```
POST /benefit/coupons/download
```

```json
{ "type": "STORE_DOWNLOAD", "key": "store-123" }
```

### 6-4. 쿠폰 삭제

```
POST /benefit/coupons/delete
```

```json
{ "coupon_keys": [101, 102], "flag": "string" }
```

### 연동 파일

- 타입: `src/domains/coupon/types/index.ts`
- API: `src/domains/coupon/api/couponApi.ts` → `getCouponList()`, `registerCoupon()`, `downloadCoupon()`, `deleteCoupons()`
- 컴포넌트: `src/domains/coupon/components/CouponListPage.tsx`

---

## 7. 마일리지

> **Base Path**: `/benefit`
> **참고**: Swagger에 delete만 존재. 상세 조회는 AOS 앱 코드에서 확인하여 추가.

### 7-1. 마일리지 상세 조회 (숙소별 적립 내역)

> Swagger 미등록 — AOS `CoolStayAPIInterface.kt` → `getMileageDetail()` 에서 확인

```
GET /benefit/users/mileage/list?store_key=store-123
```

#### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `store_key` | string | O | 숙소 키 |

#### 응답

```json
{
  "amount": 5000,
  "total_amount": 12000,
  "expire_amount": 2000,
  "points": [
    {
      "key": "p1",
      "amount": 3000,
      "remained_point": 3000,
      "status": "ACTIVE",
      "reason": "숙박 적립"
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `amount` | number | 현재 잔액 |
| `total_amount` | number | 총 적립액 |
| `expire_amount` | number | 만료 예정 금액 |
| `points` | array | 적립/사용 내역 |
| `points[].key` | string | 포인트 키 |
| `points[].amount` | number | 금액 |
| `points[].remained_point` | number | 잔여 포인트 |
| `points[].status` | string | 상태 |
| `points[].reason` | string\|null | 사유 |

### 7-2. 마일리지 적립 모텔 삭제

```
POST /benefit/mileage/delete
```

#### 요청

```json
{
  "store_keys": ["store-1", "store-2"],
  "flag": "string"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `store_keys` | string[] | O | 삭제 대상 모텔 키 배열 |
| `flag` | string | - | 추가 플래그 |

### 연동 파일

- 타입: `src/domains/mileage/types/index.ts` → `MileageDetailParams`, `MileageDetailResponse`, `MileageDeleteRequest`
- API: `src/domains/mileage/api/mileageApi.ts` → `getMileageDetail()`, `deleteMileageStores()`

---

## 테스트 현황

| API | 테스트 파일 | Cases |
|-----|------------|-------|
| Users (P2-1~4) | `src/domains/mypage/api/__tests__/mypageApi.test.ts` | 5 |
| Dibs (P2-5~6) | `src/domains/mypage/api/__tests__/mypageApi.test.ts` | 2 |
| Coupon (P2-7) | `src/domains/coupon/api/__tests__/couponApi.test.ts` | 7 |
| Mileage (P2-8) | `src/domains/mileage/api/__tests__/mileageApi.test.ts` | 3 |
