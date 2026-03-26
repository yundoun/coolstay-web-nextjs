# Contents API 명세서 — 상세 (Phase 2)

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
| `items` | DetailItem[] | 객실 목록 (상세 구조, 아래 참조) |
| `convenience_codes` | string[] | 편의시설 코드 목록 |
| `parking_yn` | string | 주차 가능 여부 |
| `parking_count` | number | 주차 가능 대수 |
| `benefit_point_rate` | number | 마일리지 적립률 (%) |
| `phone_number` | string | 전화번호 |
| `safe_number` | string | 안심번호 |
| `like_count` | number | 찜 수 |
| `benefits` | object[] | 혜택 정보 |
| `extra_services` | object[] | 부가 서비스 |
| `v2_support_flag` | object | 지원 플래그 (첫예약, 무제한쿠폰 등) |

#### DetailItem (객실 — 상세 API 전용 구조)

상세 API의 `items`는 목록 API(`StoreRoomItem`)와 구조가 다르다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 객실 고유 키 |
| `name` | string | 객실명 (ex: "Single Room", "Double Room") |
| `extras` | Extra[] | 인원/옵션 정보 (`MAX`, `MIN`, `WALK_ONLY` 등) |
| `images` | ImageItem[] | 객실 이미지 목록 |
| `sub_items` | StoreRoomItem[] | 대실/숙박 가격 정보 (카테고리별) |

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
