# Home API 명세서

> **도메인**: 홈 화면
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code`
> **최종 업데이트**: 2026-04-01 (dev 서버 실제 응답 기준)

---

## 1. 홈 메인

```
POST /home/main
```

### 요청

```json
{
  "region_code": "ALL_0100000",
  "popup_notice_yn": "N",
  "coupon_only_yn": "N"
}
```

### 실제 응답 (dev 서버 2026-04-01)

| 필드 | 타입 | 설명 |
|------|------|------|
| `banners` | array | 상단 배너 캐러셀 |
| `exhibitions` | array | **기획전** (BoardItem 구조, type="EXHIBITION") |
| `item_buttons` | array | 혜택 버튼 (무제한, 선물 등) |
| `new_item_categories` | array | 카테고리 버튼 (모텔, 호텔 등) |
| `phrase` | string | 문구 |
| `recent_stores` | array | 최근 본 숙소 |
| `recommend_categories` | array | 추천 지역 |
| `recommend_stores` | array | 추천 숙소 |
| `valid_book_yn` | string | 예약 가능 여부 |

#### banners[]

```json
{
  "key": 11597,
  "view_count": 0,
  "image_urls": ["https://..."],
  "link": { "type": "APP_LINK", "sub_type": "A_MR_24", "target": "11596", "btn_name": "이벤트 상세" },
  "reg_dt": 1630455769
}
```

#### exhibitions[] (기획전)

```json
{
  "key": 87286,
  "view_count": 0,
  "type": "EXHIBITION",
  "title": "기획전 쿠폰 테스트",
  "description": "<p>...</p>",
  "badge_image_url": "https://...",
  "banner_image_url": "https://...",
  "detail_banner_image_url": "https://...",
  "thumb_description": "기획전 쿠폰 테스트",
  "image_urls": ["https://..."],
  "link": { "type": "APP_LINK", "sub_type": "...", "target": "...", "btn_name": "" },
  "start_dt": 1743397200,
  "end_dt": 1775019599,
  "reg_dt": 1743399916
}
```

> **기획전 개별 조회**: `GET /manage/board/list?board_type=EVENT&board_item_key={key}` → type="EXHIBITION" 반환
> 이벤트와 기획전은 같은 API를 사용하되 `type` 필드로 구분 ("EXHIBITION" vs "VISIT"/"COUPON")

#### recommend_stores[]

```json
{
  "key": "D_KCST_...",
  "name": "숙소명",
  "like_count": 0,
  "consecutive_yn": "N",
  "user_like_yn": "N",
  "parking_yn": "N",
  "point_reward_type": "ORDER",
  "filter_bit": 0,
  "area_cd1": "...",
  "area_cd2": "...",
  "images": [{ "key": 149756, "description": "대표 이미지", "url": "https://...", "thumb_url": "https://..." }],
  "items": [...],
  "extra_services": [...]
}
```

---

## 2. 지역별 추천 숙소

```
POST /home/regionStores
```

### 요청

```json
{ "region_code": "ALL_0100000" }
```

### 응답

홈 메인과 동일한 `recommend_categories[]`, `recommend_stores[]` 구조.

---

## 3. 숙소 상세 (contents/details)

### 3-1. 숙소 상세 조회

```
GET /contents/details/list?motel_key={key}&search_start={YYYYMMDD}&search_end={YYYYMMDD}
```

#### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "motel": {
    "key": "D_KCST_...",
    "name": "숙소명",
    "business_type": "...",
    "like_count": 0,
    "user_like_yn": "N",
    "parking_yn": "N",
    "parking_count": 0,
    "parking_full_yn": "N",
    "parking_info": "...",
    "consecutive_yn": "N",
    "convenience_codes": ["C21", "C22", "C23", "C24"],
    "phone_number": "...",
    "safe_number": "...",
    "greeting_msg": "...",
    "rating": ...,
    "location": {...},
    "business_info": {...},
    "benefits": [...],
    "benefit_extra": ...,
    "benefit_point_rate": ...,
    "benefit_room": ...,
    "coupons": [...],
    "event": ...,
    "external_events": [...],
    "extra_services": [...],
    "images": [{ "key": ..., "description": "...", "url": "https://...", "thumb_url": "https://...", "priority": ... }],
    "items": [{ "key": "...", "name": "...", "sort_priority": ..., "package_priority": ..., "sub_items": [...], "images": [...], "extras": [...] }],
    "v2_external_links": [...],
    "v2_low_price_btn": ...,
    "v2_support_flag": ...,
    "point_reward_type": "...",
    "site_payment_yn": "...",
    "partnership_type": "...",
    "filter_bit": ...,
    "area_cd1": "...",
    "area_cd2": "...",
    "cool_consecutive_popup": ...
  }
}
```

### 3-2. 숙소 이미지 목록

```
GET /contents/images/list?motel_key={key}
```

```json
{
  "images_per_category": [
    {
      "category_code": "...",
      "category_name": "...",
      "images": [...]
    }
  ]
}
```

### 3-3. 객실 예약 현황

```
GET /contents/books/daystatus/list?motel_key={key}&room_key={key}
```

```json
{ "daily_books": [...] }
```

---

## 4. 지역 목록

```
GET /contents/regions/list?category_code=MOTEL
```

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "regions": [
    {
      "type": "R001",
      "view_type": "LIST",
      "open_yn": "Y",
      "code": "ALL_01",
      "name": "서울",
      "thumb_url": "https://...",
      "sub_regions": [...],
      "depth": 0,
      "priority": 0
    }
  ]
}
```

17개 지역 반환 (서울, 부산, 제주 등)

---

## 5. aiMagazine (칼럼/매거진)

> `/aiMagazine` API는 기획전이 아닌 **칼럼/매거진** 콘텐츠. 기획전과 별개.

```
GET /aiMagazine/board/list?count=3
```

```json
{
  "total_count": 6,
  "next_cursor": "...",
  "boards": [
    {
      "key": 13082,
      "type": "칼럼",
      "thumbnail_url": "https://...",
      "title": "회사에서 열심히 일하는 방법",
      "sub_title": "참고 하세요"
    }
  ]
}
```

```
GET /aiMagazine/board/detail?key=13082
```

```json
{
  "board_detail": {
    "key": 13082,
    "title": "...",
    "sub_title": "...",
    "profile_image_url": "https://...",
    "writer_name": "윤도운",
    "post_date": "2025.08.28",
    "writer_introduction": "사람",
    "description": "<p>...</p>",
    "package_banner": {}
  }
}
```

---

## 연동 파일

- 타입: `src/domains/home/types/index.ts`
- API: `src/domains/home/api/homeApi.ts` → `getHomeMain()`, `getRegionStores()`
