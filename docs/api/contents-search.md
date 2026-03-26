# Contents API 명세서 — 검색/목록 (Phase 1)

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)

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

## 2. GET /contents/list — 숙소 목록 조회

검색 조건(지역, 날짜, 인원 등)에 맞는 숙소 목록을 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `search_type` | string | O | 검색 유형 코드 (아래 참조) | |
| `search_extra` | string | - | 검색 부가 값 (지역코드, 숙소명 등) | |
| `search_start_date` | string | - | 체크인 날짜 (`YYYY-MM-DD`) | |
| `search_end_date` | string | - | 체크아웃 날짜 (`YYYY-MM-DD`) | |
| `search_adult_count` | number | - | 성인 수 | |
| `search_kids_count` | number | - | 아동 수 | |
| `latitude` | string | - | 위도 (ST001 위치 검색 시) | |
| `longitude` | string | - | 경도 (ST001 위치 검색 시) | |
| `sort` | string | - | 정렬 기준 | |
| `count` | number | - | 조회 개수 | |
| `cursor` | string | - | 페이징 커서 (다음 페이지 조회 시) | |

#### search_type 코드

| 코드 | 설명 | search_extra |
|------|------|-------------|
| `ST001` | 현재 위치 검색 | - (latitude/longitude 사용) |
| `ST002` | 숙소명 검색 | 숙소명 |
| `ST003` | 지역 검색 | 지역코드 (ex: `MOTEL_1`) |
| `ST004` | 마일리지 모텔 | - |
| `ST005` | 인기 키워드 검색 | 편의시설 코드 |
| `ST006` | 찜한 모텔 | - |
| `ST007` | 최근 본 모텔 | 모텔 key 목록 (콤마 구분, 최대 50개) |
| `ST008` | 이벤트 필터 | 이벤트 필터 코드 |

#### sort 값

| 값 | 설명 |
|----|------|
| `RATING` | 평점 높은 순 |
| `STAY_PRICE_LOW` | 숙박 가격 낮은 순 |
| `STAY_PRICE_HIGH` | 숙박 가격 높은 순 |
| `RENT_PRICE_LOW` | 대실 가격 낮은 순 |
| `KEYWORD` | 꿀키워드순 |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalCount` | number | 전체 결과 수 |
| `nextCursor` | string | 다음 페이지 커서 |
| `motels` | StoreItem[] | 숙소 목록 |
| `isDuringEvent` | string? | 이벤트 기간 여부 |
| `priorityMotels` | StoreItem[]? | 우선 표시 숙소 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `SearchPageLayout` (지역 선택 시) | `src/domains/search/components/SearchPageLayout.tsx` |

---

## 3. GET /contents/total/list — 제휴점 전체 목록 조회

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

## 4. GET /contents/filter — 필터 기반 제휴점 key 조회

검색 조건에 맞는 제휴점 key 목록을 반환한다. `filter/list`와 2단계로 사용한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `type` | string | O | 검색 유형 (ST003 등) | |
| `extraType` | string | - | 부가 검색 값 (지역코드 등) | |
| `checkIn` | string | - | 체크인 날짜 | |
| `checkOut` | string | - | 체크아웃 날짜 | |
| `adultCnt` | number | - | 성인 수 | |
| `kidCnt` | number | - | 아동 수 | |
| `latitude` | string | - | 위도 | |
| `longitude` | string | - | 경도 | |
| `businessType` | string | - | 업종 타입 필터 | |
| `storeType` | string | - | 제휴 타입 필터 | |
| `sort` | string | - | 정렬 기준 | |
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

---

## 5. POST /contents/filter/list — 필터 결과 숙소 목록 조회 (페이징)

`filter`에서 받은 key 목록으로 숙소 상세 정보를 페이징 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `checkIn` | string | O | 체크인 날짜 |
| `checkOut` | string | O | 체크아웃 날짜 |
| `adultCount` | number | - | 성인 수 |
| `kidsCount` | number | - | 아동 수 |
| `type` | string | - | 검색 유형 |
| `latitude` | string | - | 위도 |
| `longitude` | string | - | 경도 |
| `isCompress` | number | - | 압축 여부 |

### Request Body

```json
{
  "filters": [
    { "v2Key": "...", "v2RentKey": "...", "v2StayKey": "...", "filterBit": 0 }
  ]
}
```

### Response (`result`)

`contents/list`와 동일한 `ContentsListResponse` 구조.

### 웹 사용처

Hook 준비 완료 (`useFilterKeys` + `getFilterList`), 고급 필터 UI 연동 시 사용 예정

---

## 6. GET /contents/myArea/list — 내 주변 추천 숙소 조회

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
| `tags` | Tag[] | 필터 태그 목록 (숙박세일 페스타, 찜선물 등) |
| `init_tag` | Tag? | 초기 선택 태그 |
| `motels` | StoreItem[] | 주변 숙소 목록 |

### 웹 사용처

| 컴포넌트 | 파일 |
|----------|------|
| `SearchPageLayout` (지역 미선택 시 기본 표시) | `src/domains/search/components/SearchPageLayout.tsx` |

### 비고

- 현재 서울(37.5665, 126.9780) 좌표를 기본값으로 사용
- 추후 브라우저 Geolocation API 연동 시 실제 사용자 위치 사용 예정

---

## 공통 타입 참조

### StoreItem (숙소 간략 정보)

목록 API에서 반환되는 숙소 정보. 상세 API(`contents/details/list`)의 `Motel`보다 간략한 형태.

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | string | 숙소 고유 키 |
| `filter_bit` | number | 필터 비트 |
| `partnership_type` | string? | 제휴 타입 (`COOLSTAY` 등) |
| `name` | string | 숙소명 |
| `like_count` | number | 찜 수 |
| `distance` | string? | 거리 (m 단위) |
| `consecutive_yn` | string | 연박 가능 여부 |
| `parking_yn` | string | 주차 가능 여부 |
| `point_reward_type` | string | 포인트 적립 타입 |
| `images` | ImageItem[] | 이미지 목록 |
| `items` | StoreRoomItem[] | 객실 목록 (대실/숙박 가격 포함) |
| `extra_services` | object[] | 부가 서비스 목록 |

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
│   └── contentsApi.ts         # API 함수 (getRegions, getContentsList, ...)
├── hooks/
│   └── useContentsData.ts     # React Query hooks
├── utils/
│   └── mapStoreToAccommodation.ts  # StoreItem → AccommodationCard 변환
└── components/
    └── SearchPageLayout.tsx   # 검색 결과 페이지 (API 연동)

src/lib/api/
├── client.ts                  # API 클라이언트 (토큰 관리, retry)
└── types.ts                   # 전체 타입 정의
```
