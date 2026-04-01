# Contents API 명세서 — 리뷰 + 키워드 (Phase 3)

> 최종 업데이트: 2026-04-01

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)

---

## 1. GET /contents/reviews/list — 리뷰 목록 조회

숙소의 리뷰 목록을 페이징 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `search_type` | string | O | 검색 유형 (아래 참조) |
| `search_extra` | string | O | 검색 대상 키 (motel_key 또는 review_key) |
| `count` | number | - | 페이지당 개수 |
| `cursor` | string | - | 페이징 커서 |

#### search_type 코드

| 코드 | 설명 | search_extra |
|------|------|-------------|
| `ST301` | 전체 리뷰 | motel_key |
| `ST302` | 내가 쓴 리뷰 | - |
| `ST303` | 특정 리뷰 | review_key |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 리뷰 수 |
| `available_count` | number | 작성 가능 리뷰 수 |
| `avg_score` | string? | 평균 평점 |
| `next_cursor` | string? | 다음 페이지 커서 |
| `reviews` | Review[] | 리뷰 목록 |

#### 실제 응답 예시

```json
{
  "total_count": 2,
  "available_count": 1,
  "avg_score": "4.5",
  "next_cursor": "...",
  "reviews": [
    {
      "key": 2667,
      "best_yn": "Y",
      "item_description": "거울룸",
      "score": "5",
      "text": "아주짱",
      "status": "S",
      "reg_dt": 1751418887,
      "motel": {
        "key": "D_KCST_...",
        "name": "도운텔2",
        "location": { "address": "부산광역시 ..." },
        "images": [{ "key": 149737, "url": "https://...", "thumb_url": "https://...", "priority": -1 }]
      },
      "user": { "key": 11471, "name": "윤도운" },
      "comment": { "key": 297, "text": "7월파이팅", "reg_dt": 1751438372 },
      "status_info": { "start_date": 1754985586 },
      "images": [{ "url": "https://...", "thumb_url": "https://...", "priority": -1 }]
    }
  ]
}
```

### 웹 사용처

Hook: `useReviewList` — 숙소 상세 리뷰 섹션, 마이페이지 내 리뷰

---

## 2. POST /contents/reviews/register — 리뷰 등록

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `book_id` | string | O | 예약 ID |
| `motel_key` | string | O | 숙소 키 |
| `motel_name` | string | O | 숙소명 |
| `score` | string | O | 평점 (0.0~5.0) |
| `description` | string | O | 리뷰 내용 |
| `images` | object[] | - | 이미지 (`{ oriUrl, thumbUrl }`) |

### Response

성공 시 빈 result 반환.

### 웹 사용처

Hook: `useRegisterReview` (mutation)

---

## 3. POST /contents/reviews/update — 리뷰 수정

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `review_key` | string | O | 리뷰 키 |
| `score` | string | O | 수정된 평점 |
| `description` | string | O | 수정된 내용 |
| `images` | object[] | - | 수정된 이미지 |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `review` | Review | 수정된 리뷰 |

### 웹 사용처

Hook: `useUpdateReview` (mutation)

---

## 4. POST /contents/reviews/delete — 리뷰 삭제

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `review_key` | string | O | 삭제할 리뷰 키 |

### 웹 사용처

Hook: `useDeleteReview` (mutation)

---

## 5. POST /contents/reviews/status/update — 리뷰 상태 수정

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `review_key` | string | O | 리뷰 키 |
| `status` | string | O | 변경할 상태 코드 |

### 웹 사용처

Hook: `useUpdateReviewStatus` (mutation)

---

## 6. GET /contents/total/keywordList — 꿀키워드 전체 목록

전체 꿀키워드 목록을 반환한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `isCompress` | number | - | 압축 여부 | `0` |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_count` | number | 전체 키워드 수 |
| `keyword_lists` | KeywordItem[] | 키워드 목록 |

#### KeywordItem

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | string | 키워드 타입 |
| `keyword` | string | 키워드 텍스트 |
| `count` | number | 해당 키워드 숙소 수 |

### 웹 사용처

Hook: `useKeywordList` — 검색 페이지 키워드 필터

---

## 7. GET /contents/search/keyword — 꿀키워드로 제휴점 key 조회

키워드 검색 조건에 맞는 제휴점 key 목록을 반환한다. `keyword/list`와 2단계로 사용.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `type` | string | O | 검색 유형 |
| `extraType` | string | - | 부가 검색 값 |
| `checkIn` | string | - | 체크인 날짜 |
| `checkOut` | string | - | 체크아웃 날짜 |
| `adultCnt` | number | - | 성인 수 |
| `kidCnt` | number | - | 아동 수 |
| `latitude` | string | - | 위도 |
| `longitude` | string | - | 경도 |
| `sort` | string | - | 정렬 |
| `businessType` | string | - | 업종 |
| `isCompress` | number | - | 압축 여부 |

### Response (`result`)

`FilterResponse`와 동일 구조 (filters, banners, tags 등).

### 웹 사용처

Hook: `useKeywordSearchKeys`

---

## 8. POST /contents/search/keyword/list — 꿀키워드 검색 결과 (페이징)

`keyword`에서 받은 key 목록으로 숙소 상세 정보를 페이징 조회한다.

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `checkIn` | string | O | 체크인 날짜 |
| `checkOut` | string | O | 체크아웃 날짜 |
| `adultCount` | number | - | 성인 수 |
| `kidsCount` | number | - | 아동 수 |
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

### Response

`ContentsListResponse`와 동일 구조.

### 웹 사용처

API 함수: `getKeywordSearchList` — 키워드 검색 결과 페이지

---

## 공통 타입 참조

### Review

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | number | 리뷰 고유 키 |
| `best_yn` | string | 베스트 리뷰 여부 |
| `item_description` | string | 객실 설명 |
| `score` | string | 평점 (0.0~5.0) |
| `text` | string | 리뷰 내용 |
| `status` | string | 리뷰 상태 |
| `reg_dt` | number | 등록일시 (Unix timestamp, 초 단위) |
| `motel` | MotelBasic? | 숙소 기본 정보 |
| `user` | `{ key: number; name: string }`? | 작성자 정보 |
| `comment` | Comment? | 사장님 답변 (`reg_dt`는 number) |
| `status_info` | `{ start_date: number }`? | 상태 정보 (이용일 등) |
| `images` | ReviewImage[]? | 리뷰 이미지 (`{ url, thumb_url?, priority? }`) |

---

## 웹 코드 구조

```
src/domains/review/
├── api/
│   └── reviewApi.ts           # 리뷰 CRUD API 함수
└── hooks/
    └── useReviewData.ts       # React Query hooks + mutations

src/domains/search/
├── api/
│   └── keywordApi.ts          # 키워드 검색 API 함수
└── hooks/
    └── useKeywordData.ts      # React Query hooks
```
