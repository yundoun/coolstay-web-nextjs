# Contents API 명세서 — 상세 (Phase 2)

> **최종 업데이트: 2026-04-06 (coolstay-domain-analysis 스펙 기준)**

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)

---

## 1. GET /contents/details/list — 숙소 상세정보 조회

숙소의 전체 상세 정보를 반환한다. 객실, 이미지, 리뷰, 편의시설, 위치 등 포함.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `motel_key` | string | O | 숙소 고유 키 | |
| `search_start` | string | - | 체크인 날짜 (`YYYYMMDD`) | |
| `search_end` | string | - | 체크아웃 날짜 (`YYYYMMDD`) | |
| `pure_click_yn` | string | - | 조회수 카운트 여부 | `N` |
| `item_key` | string | - | 특정 객실 키 (객실 지정 조회 시) | |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `motel` | Motel | 숙소 전체 상세 정보 (아래 참조) |

#### Motel 전체 키 목록 (실제 응답 기준)

```
area_cd1, area_cd2, benefit_extra, benefit_point_rate, benefit_room, benefits,
business_info, business_type, consecutive_yn, convenience_codes,
cool_consecutive_popup, coupons, event, external_events, extra_services,
filter_bit, greeting_msg, images, items, key, like_count, location, name,
parking_count, parking_full_yn, parking_info, parking_yn, partnership_type,
phone_number, point_reward_type, rating, safe_number, site_payment_yn,
user_like_yn, v2_external_links, v2_low_price_btn, v2_support_flag
```

#### Motel 주요 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 숙소 고유 키 |
| `name` | string | 숙소명 |
| `partnership_type` | string | 제휴 타입 (`COOLSTAY`, `ONDA` 등) |
| `business_type` | string | 업종 (`MOTEL`, `HOTEL` 등) |
| `rating` | Rating | 평점 정보 (`avg_score`, `review_count`, `reviews[]`) |
| `business_info` | object | 사업자 정보 (상호명, 주소, 사업자번호 등) |
| `location` | Location | 위치 (`address`, `latitude`, `longitude`) |
| `images` | ImageItem[] | 대표 이미지 목록 |
| `items` | ItemObj[] | 객실 목록 (아래 참조). sub_items에 대실/숙박 패키지 |
| `convenience_codes` | string[] | 편의시설 코드 목록 |
| `parking_yn` | string | 주차 가능 여부 |
| `parking_count` | number | 주차 가능 대수 |
| `parking_full_yn` | string | 주차장 만차 여부 |
| `parking_info` | object | 주차 상세 정보 |
| `benefit_point_rate` | number | 마일리지 적립률 (%) |
| `benefit_extra` | object | 추가 혜택 정보 |
| `benefit_room` | object | 객실 혜택 정보 |
| `phone_number` | string | 전화번호 |
| `safe_number` | string | 안심번호 |
| `like_count` | number | 찜 수 |
| `user_like_yn` | string | 사용자 찜 여부 |
| `benefits` | BenefitItem[] | 혜택 아이콘 목록 (배열) |
| `coupons` | Coupon[] | 쿠폰 정보 (배열) |
| `extra_services` | ExtraService[] | 부가 서비스 (배열) |
| `event` | Banner[] | 이벤트 정보 (배열) |
| `external_events` | Banner[] | 숙박대전 이벤트 (배열) |
| `v2_support_flag` | SupportFlag | 지원 플래그 (`is_` 접두사, 아래 참조) |
| `max_discount_amount` | number? | 최대 할인 금액 |
| `v2_external_links` | object[] | 외부 링크 목록 |
| `v2_low_price_btn` | object | 최저가 버튼 정보 |
| `area_cd1` | string | 지역 코드 1 |
| `area_cd2` | string | 지역 코드 2 |
| `consecutive_yn` | string | 연박 가능 여부 |
| `cool_consecutive_popup` | object | 연박 팝업 정보 |
| `filter_bit` | number | 필터 비트 |
| `greeting_msg` | string | 인사 메시지 |
| `point_reward_type` | string | 포인트 적립 타입 |
| `site_payment_yn` | string | 현장 결제 가능 여부 |

#### ItemObj (객실/패키지 — V1ContentItemVO.ItemObj)

상세 API와 목록 API 공통으로 사용되는 통합 타입. `sub_items`에 대실/숙박 패키지가 위치하며, **예약 시에는 sub_items의 key를 사용해야 한다.**

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 객실 고유 키 |
| `price` | number | 정가 |
| `discount_price` | number | 판매가 |
| `consecutive_price` | number | 연박 추가 요금 |
| `name` | string | 객실명 |
| `description` | string | 객실 설명 |
| `category` | ItemCategory | 카테고리 (`{ code, name }`) |
| `extras` | CodeObj[] | 부가 정보 (`STIME`, `ETIME`, `UTIME`, `MAX_ADULT` 등) |
| `keywords` | string[]? | 키워드 |
| `images` | ImageItem[]? | 객실 이미지 목록 |
| `coupons` | Coupon[]? | 객실 쿠폰 |
| `daily_extras` | DailyExtra[]? | 일별 판매 정보 |
| `sub_items` | ItemObj[]? | ★ 하위 패키지 (대실/숙박). 예약 시 이 키 사용 |
| `package_priority` | number? | 패키지 정렬 순서 |
| `sort_priority` | number? | 기본 정렬 순서 |

#### SupportFlag (V1ContentItemVO.SupportFlag)

| 필드 | 타입 | 설명 |
|------|------|------|
| `is_first_reserve` | boolean | 첫예약 |
| `is_visit_korea` | boolean | 숙박대전 |
| `is_low_price_korea` | boolean | 국내 최저가 |
| `is_favor_coupon_store` | boolean | 찜쿠폰 |
| `is_unlimited_coupon` | boolean | 무제한 쿠폰 |
| `is_revisit` | boolean | 재방문 |

#### ImageItem (실제 응답 키)

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 이미지 고유 키 |
| `url` | string | 원본 이미지 URL |
| `thumb_url` | string | 썸네일 이미지 URL |
| `description` | string | 이미지 설명 |
| `priority` | number | 정렬 순서 |

#### sub_items 카테고리 코드

| code | 설명 |
|------|------|
| `010101` | 대실 |
| `010102` | 숙박 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `AccommodationDetailPage` | `src/domains/accommodation/components/AccommodationDetailPage.tsx` |
| `AccommodationDetailLayout` | `src/domains/accommodation/components/AccommodationDetailLayout.tsx` |

---

## 2. GET /contents/images/list — 이미지 목록 조회

숙소의 이미지를 카테고리별로 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `motel_key` | string | O | 숙소 고유 키 |

### Response (`result`)

실제 응답 구조:

```json
{
  "images_per_category": [
    {
      "category_code": "IC003",
      "category_name": "대표",
      "images": [
        { "key": "...", "url": "...", "thumb_url": "...", "description": "...", "priority": 0 }
      ]
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `images_per_category` | ImageCategory[] | 카테고리별 이미지 목록 |

#### ImageCategory

| 필드 | 타입 | 설명 |
|------|------|------|
| `category_code` | string | 카테고리 코드 |
| `category_name` | string | 카테고리명 |
| `images` | ImageItem[] | 이미지 목록 |

#### 카테고리 코드

| code | 설명 |
|------|------|
| `IC003` | 대표 이미지 |
| `IC004` | 내부 이미지 |
| `IC005` | 외부 이미지 |
| `IC006` | 장비/가구 이미지 |
| `IC007` | 편의시설 이미지 |
| `IC100` | 객실 이미지 |

### 웹 사용처

Hook 준비 완료 (`useStoreImages`), 이미지 전체보기 갤러리 구현 시 사용 예정

---

## 3. GET /contents/books/daystatus/list — 일별 예약 가능여부 조회

특정 객실의 일별 예약 가능 여부를 반환한다. 캘린더 UI에서 예약 불가일 표시에 사용.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `motel_key` | string | O | 숙소 고유 키 |
| `room_key` | string | O | 객실 고유 키 |

### Response (`result`)

실제 응답 구조:

```json
{
  "daily_books": [
    { "date": 1711929600, "v2_date": "20260401", "status": "Y" }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `daily_books` | DailyBook[] | 일별 예약 상태 목록 |

#### DailyBook

| 필드 | 타입 | 설명 |
|------|------|------|
| `date` | number | Unix timestamp |
| `v2_date` | string | 날짜 (`YYYYMMDD`) |
| `status` | string | 예약 가능 여부 (`Y`: 가능, `N`: 불가) |

### 웹 사용처

Hook 준비 완료 (`useDailyBookStatus`), 객실 선택 캘린더 구현 시 사용 예정

---

## 4. GET /contents/refund-policy/list — 취소/환불 규정 조회

외부 제휴(ONDA 등) 객실의 취소/환불 규정을 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `store_key` | string | O | 숙소 고유 키 |
| `item_key` | string | O | 객실 고유 키 |
| `search_start_date` | string | O | 체크인 날짜 (`YYYYMMDD`) |
| `search_end_date` | string | O | 체크아웃 날짜 (`YYYYMMDD`) |
| `pack_key` | string | - | 패키지 키 (패키지 상품인 경우) |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `refund_policies` | RefundPolicy[] | 환불 규정 목록 |

#### RefundPolicy

| 필드 | 타입 | 설명 |
|------|------|------|
| `until` | string | 취소 기한 (ex: "3일 전", "당일") |
| `percent` | number | 환불 비율 (%) |
| `amount` | number | 환불 금액 (원) |

### 비고

- COOLSTAY 직영 숙소는 `motel.refund_policy` 필드에 텍스트로 규정 포함
- 외부 제휴(ONDA) 숙소만 이 API로 별도 규정 조회 필요
- `50030001` 응답 코드: 해당 숙소에 환불 규정 없음

### 웹 사용처

Hook 준비 완료 (`useRefundPolicy`), 예약 확인 화면에서 사용 예정

---

## 웹 코드 구조

```
src/domains/accommodation/
├── api/
│   └── detailApi.ts              # API 함수
├── hooks/
│   └── useDetailData.ts          # React Query hooks
├── utils/
│   └── mapMotelToDetail.ts       # Motel → AccommodationDetail 변환
└── components/
    ├── AccommodationDetailPage.tsx  # API 연동 래퍼 (클라이언트)
    └── AccommodationDetailLayout.tsx # 상세 페이지 레이아웃
```
