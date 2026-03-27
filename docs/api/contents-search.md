# Contents API 명세서 — 검색/목록

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)

---

## 검색 API 호출 패턴

웹에서 사용하는 검색은 **모두 2단계 API**로 동작한다. AOS 앱과 동일한 패턴.

```
키워드 검색: GET /contents/search/keyword → POST /contents/search/keyword/list
지역 검색:   GET /contents/filter         → POST /contents/filter/list
```

### 공통 필수 파라미터 (1단계)

| 파라미터 | 값 | 비고 |
|---------|---|------|
| `sort` | `BENEFIT` | **필수** — 없으면 서버가 검색 실행 안 함 |
| `checkIn` | `yyyyMMdd` | 하이픈 없음 (ex: `20260327`) |
| `checkOut` | `yyyyMMdd` | 하이픈 없음 |
| `latitude` | `""` | 빈 문자열이라도 포함해야 함 |
| `longitude` | `""` | 빈 문자열이라도 포함해야 함 |
| `isCompress` | `0` | 웹에서는 비압축 사용 |

> **주의**: `contents/list` API는 dev 서버에서 빈 결과를 반환한다. AOS 앱도 이 엔드포인트를 검색에 사용하지 않음 (마일리지 모텔 조회 등 특수 용도로만 사용).

---

## 1. GET /contents/regions/list — 지역 정보 조회

지역 선택 UI에 사용할 도시/하위 지역 트리를 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `category_code` | string | O | 지역 카테고리 코드 | `MOTEL` |

`category_code` 값: `MOTEL`, `SUBWAY`, `MOTEL,SUBWAY` (콤마 구분으로 복수 가능)

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `regions` | RegionItem[] | 지역 트리 (1depth: 시/도, sub_regions: 상세 지역) |
| `subways` | RegionItem[] | 지하철 지역 (category에 SUBWAY 포함 시) |

#### RegionItem

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | string | 타입 코드 (ex: `R001`) |
| `view_type` | string | 표시 방식 (`LIST`) |
| `open_yn` | string | 노출 여부 (`Y`/`N`) |
| `code` | string | 지역 코드 (ex: `MOTEL_1`, `MOTEL_9300001`) |
| `name` | string | 지역명 (ex: `서울`, `강남/역삼/삼성/논현`) |
| `thumb_url` | string? | 썸네일 이미지 URL |
| `geometry` | object? | `{ latitude, longitude }` — 하위 지역에만 존재 |
| `sub_regions` | RegionItem[] | 하위 지역 목록 |
| `depth` | number | 트리 깊이 (0: 시/도, 1: 상세 지역) |
| `priority` | number | 정렬 순서 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `SearchModal > RegionPanel` (모바일) | `src/components/search/SearchModal.tsx` |
| `SearchConditionBar > RegionDropdown` (PC) | `src/domains/search/components/SearchConditionBar.tsx` |

### 비고

- `open_yn === "N"`인 지역은 UI에서 필터링
- API 실패 시 `src/domains/search/data/regions.ts` mock 데이터로 폴백

---

## 2. GET /contents/search/keyword — 키워드 검색 1단계 (key 조회)

키워드(숙소명 등)로 제휴점 filter key 목록을 반환한다. 2단계(`keyword/list`)에 전달하여 실제 숙소 정보를 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `type` | string | O | 검색 유형 코드 | `ST701` |
| `extraType` | string | - | 검색어 (숙소명, 키워드 등) | |
| `checkIn` | string | - | 체크인 날짜 (`yyyyMMdd`) | |
| `checkOut` | string | - | 체크아웃 날짜 (`yyyyMMdd`) | |
| `adultCnt` | number | - | 성인 수 | |
| `kidCnt` | number | - | 아동 수 | |
| `latitude` | string | - | 위도 (빈 문자열 가능) | |
| `longitude` | string | - | 경도 (빈 문자열 가능) | |
| `sort` | string | **O** | 정렬 기준 | `BENEFIT` |
| `isCompress` | number | - | 압축 여부 | `0` |

#### type 코드 (AOS ServerCode.SearchConditionType)

| 코드 | 설명 | extraType |
|------|------|-----------|
| `ST701` | 키워드 검색 (검색어) | 검색어 |
| `ST003` | 지역 검색 | 지역코드 (→ filter API 사용) |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 결과 수 (-1이면 검색 미실행) |
| `check_in` | string | 체크인 날짜 |
| `check_out` | string | 체크아웃 날짜 |
| `adult_count` | number | 성인 수 |
| `kids_count` | number | 아동 수 |
| `filters` | FilterKey[] | 제휴점 key 목록 (2단계에 전달) |
| `banners` | Banner[] | 검색 결과 배너 |
| `recommend_keyword` | string | 추천 키워드 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `useKeywordSearch` (1단계) | `src/domains/search/hooks/useKeywordData.ts` |
| `SearchPageLayout` (키워드 검색 시) | `src/domains/search/components/SearchPageLayout.tsx` |

---

## 3. POST /contents/search/keyword/list — 키워드 검색 2단계 (숙소 목록)

1단계에서 받은 filter key 목록으로 숙소 상세 정보를 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `checkIn` | string | O | 체크인 날짜 (`yyyyMMdd`) |
| `checkOut` | string | O | 체크아웃 날짜 (`yyyyMMdd`) |
| `adultCount` | number | - | 성인 수 |
| `kidsCount` | number | - | 아동 수 |
| `latitude` | string | - | 위도 |
| `longitude` | string | - | 경도 |
| `isCompress` | number | - | 압축 여부 | `0` |

> **주의**: 1단계는 `adultCnt`/`kidCnt`, 2단계는 `adultCount`/`kidsCount` (파라미터명 다름)

### Request Body

```json
{
  "filters": [
    { "v2Key": "...", "v2RentKey": "...", "v2StayKey": "...", "filterBit": 0 }
  ]
}
```

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalCount` | number | 전체 결과 수 |
| `motels` | StoreItem[] | 숙소 목록 |
| `isDuringEvent` | string? | 이벤트 기간 여부 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `useKeywordSearch` (2단계) | `src/domains/search/hooks/useKeywordData.ts` |

---

## 4. GET /contents/filter — 지역 검색 1단계 (key 조회)

지역 등 검색 조건에 맞는 제휴점 key 목록을 반환한다. `filter/list`와 2단계로 사용한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `type` | string | O | 검색 유형 (`ST003` 등) | |
| `extraType` | string | - | 부가 검색 값 (지역코드 등) | |
| `checkIn` | string | - | 체크인 날짜 (`yyyyMMdd`) | |
| `checkOut` | string | - | 체크아웃 날짜 (`yyyyMMdd`) | |
| `adultCnt` | number | - | 성인 수 | |
| `kidCnt` | number | - | 아동 수 | |
| `latitude` | string | - | 위도 (빈 문자열 가능) | |
| `longitude` | string | - | 경도 (빈 문자열 가능) | |
| `sort` | string | **O** | 정렬 기준 | `BENEFIT` |
| `isCompress` | number | - | 압축 여부 | `0` |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 결과 수 |
| `check_in` | string | 체크인 날짜 |
| `check_out` | string | 체크아웃 날짜 |
| `adult_count` | number | 성인 수 |
| `kids_count` | number | 아동 수 |
| `tags` | Tag[]? | 필터 태그 목록 |
| `filters` | FilterKey[] | 제휴점 key 목록 (filter/list에 전달) |
| `banners` | Banner[] | 검색 결과 배너 |

#### FilterKey

| 필드 | 타입 | 설명 |
|------|------|------|
| `v2Key` | string | V2 제휴점 키 |
| `v2RentKey` | string | 대실 키 |
| `v2StayKey` | string | 숙박 키 |
| `filterBit` | number | 필터 비트 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `useFilterSearch` (1단계) | `src/domains/search/hooks/useContentsData.ts` |
| `SearchPageLayout` (지역 선택 시) | `src/domains/search/components/SearchPageLayout.tsx` |

---

## 5. POST /contents/filter/list — 지역 검색 2단계 (숙소 목록)

`filter`에서 받은 key 목록으로 숙소 상세 정보를 페이징 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `checkIn` | string | O | 체크인 날짜 (`yyyyMMdd`) |
| `checkOut` | string | O | 체크아웃 날짜 (`yyyyMMdd`) |
| `adultCount` | number | - | 성인 수 |
| `kidsCount` | number | - | 아동 수 |
| `type` | string | - | 검색 유형 |
| `latitude` | string | - | 위도 |
| `longitude` | string | - | 경도 |
| `isCompress` | number | - | 압축 여부 |

> **주의**: 1단계는 `adultCnt`/`kidCnt`, 2단계는 `adultCount`/`kidsCount` (파라미터명 다름)

### Request Body

```json
{
  "filters": [
    { "v2Key": "...", "v2RentKey": "...", "v2StayKey": "...", "filterBit": 0 }
  ]
}
```

### Response (`result`)

`keyword/list`와 동일한 `ContentsListResponse` 구조.

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `useFilterSearch` (2단계) | `src/domains/search/hooks/useContentsData.ts` |

---

## 6. GET /contents/total/list — 제휴점 전체 목록 조회

전체 제휴점 목록을 지역/키워드 검색 결과 형태로 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `isCompress` | number | - | 압축 여부 (0: 비압축) | `0` |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 결과 수 |
| `keyword_lists` | object[]? | 키워드 목록 (`{ type, keyword, count }`) |
| `search_results` | SearchResult[] | 검색 결과 목록 |

#### SearchResult

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | string | 타입 (`R`: 지역, `M`: 모텔, `S`: 지하철) |
| `sub_type` | string | 하위 타입 |
| `entity_id` | string | 엔티티 ID |
| `entity_name` | string | 엔티티 이름 |
| `location` | Location | 위치 정보 |
| `v2_entity_id` | string | V2 엔티티 ID |
| `v2_keywords` | string[] | V2 키워드 목록 |

### 웹 사용처

Hook 준비 완료 (`useTotalList`), 자동완성 검색 UI 연동 시 사용 예정

---

## 7. GET /contents/list — 숙소 목록 조회 (단일 호출)

> **참고**: 웹/AOS 앱 모두 일반 검색에는 이 API를 사용하지 않음. 마일리지 모텔(ST004) 등 특수 용도로만 사용.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `search_type` | string | O | 검색 유형 코드 |
| `search_extra` | string | - | 검색 부가 값 |
| `search_start_date` | string | - | 체크인 날짜 |
| `search_end_date` | string | - | 체크아웃 날짜 |
| `search_adult_count` | number | - | 성인 수 |
| `search_kids_count` | number | - | 아동 수 |
| `sort` | string | - | 정렬 기준 |
| `count` | number | - | 조회 개수 |
| `cursor` | string | - | 페이징 커서 |

#### search_type 코드

| 코드 | 설명 | search_extra |
|------|------|-------------|
| `ST001` | 현재 위치 검색 | - (latitude/longitude 사용) |
| `ST002` | 숙소명 검색 | 숙소명 |
| `ST003` | 지역 검색 | 지역코드 |
| `ST004` | 마일리지 모텔 | - |
| `ST005` | 인기 키워드 검색 | 편의시설 코드 |
| `ST006` | 찜한 모텔 | - |
| `ST007` | 최근 본 모텔 | 모텔 key 목록 (콤마 구분, 최대 50개) |
| `ST008` | 이벤트 필터 | 이벤트 필터 코드 |

---

## 8. GET /contents/myArea/list — 내 주변 추천 숙소 조회

위치 기반으로 주변 숙소를 추천한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `latitude` | string | O | 위도 | |
| `longitude` | string | O | 경도 | |
| `businessType` | string | - | 업종 카테고리 코드 | `MOTEL` |
| `filterBit` | number | - | 필터 비트 | `-100` |
| `isCompress` | number | - | 압축 여부 | `0` |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 결과 수 |
| `tags` | Tag[] | 필터 태그 목록 |
| `init_tag` | Tag? | 초기 선택 태그 |
| `motels` | StoreItem[] | 주변 숙소 목록 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `SearchPageLayout` (키워드·지역 모두 미선택 시 폴백) | `src/domains/search/components/SearchPageLayout.tsx` |

### 비고

- 현재 서울(37.5665, 126.9780) 좌표를 기본값으로 사용
- 추후 브라우저 Geolocation API 연동 시 실제 사용자 위치 사용 예정

---

## 공통 타입 참조

### StoreItem (숙소 간략 정보)

목록 API에서 반환되는 숙소 정보. 상세 API(`contents/details/list`)의 `Motel`보다 간략한 형태.

| 필드 | 타입 | 설명 | 카드 매핑 |
|------|------|------|----------|
| `key` | string | 숙소 고유 키 | `id` |
| `filter_bit` | number | 필터 비트 | - |
| `partnership_type` | string? | 제휴 타입 (`COOLSTAY` 등) | `partnershipType` + 태그 |
| `name` | string | 숙소명 | `name` |
| `like_count` | number | 찜 수 | `likeCount` |
| `user_like_yn` | string | 사용자 찜 여부 | `isLiked` |
| `distance` | string? | 거리 (m 단위) | `location` |
| `consecutive_yn` | string | 연박 가능 여부 | `consecutiveYn` + 태그 |
| `parking_yn` | string | 주차 가능 여부 | 태그 |
| `point_reward_type` | string | 포인트 적립 타입 | - |
| `images` | ImageItem[] | 이미지 목록 | `imageUrl` (첫 번째) |
| `items` | StoreRoomItem[] | 객실 목록 | `price`, `originalPrice`, `priceLabel` |
| `extra_services` | object[] | 부가 서비스 목록 | 태그 |

### StoreRoomItem (객실 정보)

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 객실 키 |
| `price` | number | 정가 |
| `discount_price` | number | 할인가 |
| `consecutive_price` | number | 연박 가격 |
| `name` | string | 객실명 |
| `category` | object | `{ code, name }` — `010101`: 대실, `010102`: 숙박 |
| `daily_extras` | DailyExtra[]? | 일별 추가 정보 (가격, 잔여 수 등) |

### Tag (필터 태그)

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | number | 태그 키 |
| `type` | string | `FILTER` 또는 `SORT` |
| `classify` | string | 분류 코드 |
| `name` | string | 태그 이름 |
| `priority` | number | 정렬 순서 |
| `filterBit` | number | 필터 비트 값 |
| `sortType` | string | 정렬 타입 (`NONE` 등) |

---

## 웹 코드 구조

```
src/domains/search/
├── api/
│   ├── contentsApi.ts         # 지역/필터 API (getRegions, getFilterKeys, getFilterList, ...)
│   └── keywordApi.ts          # 키워드 검색 API (getKeywordSearchKeys, getKeywordSearchList, ...)
├── hooks/
│   ├── useContentsData.ts     # React Query hooks (useFilterSearch 2단계, useMyAreaList, ...)
│   └── useKeywordData.ts      # 키워드 검색 hooks (useKeywordSearch 2단계)
├── utils/
│   └── mapStoreToAccommodation.ts  # StoreItem → AccommodationCard 변환
└── components/
    └── SearchPageLayout.tsx   # 검색 결과 페이지 (키워드/지역/myArea 분기)

src/lib/api/
├── client.ts                  # API 클라이언트 (토큰 관리, retry)
└── types.ts                   # 전체 타입 정의
```
