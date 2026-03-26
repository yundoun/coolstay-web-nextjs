# Home API 명세서

> Base URL: `http://dev.server.coolstay.co.kr:9000/api/v2/mobile`
> 인증: `app-token` + `app-secret-code` 헤더 (임시 토큰: `POST /auth/sessions/temporary`)

---

## 1. POST /home/main — 홈 화면 정보 조회

홈 화면 렌더링에 필요한 전체 데이터를 한 번에 반환한다.

### Request Body

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `region_code` | string | O | 최상위 지역 코드 | `ALL_0100000` (강남/역삼/삼성/논현) |
| `popup_notice_yn` | string | O | 전면팝업 조회 여부 | `N` |
| `coupon_only_yn` | string | O | 쿠폰 정보만 요청 여부 (Y: 쿠폰/마일리지만) | `N` |
| `convenience_codes` | string | - | 편의시설 코드 (콤마 구분, 최대 5개) | |
| `refresh_date` | string | - | 추천 재설정 일자 (yyyyMMdd) | |
| `recent_store_keys` | string | - | 최근 본 업소 key (콤마 구분, 비회원만) | |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `recommend_categories` | RegionCategory[] | 추천 지역 카테고리 탭 (서울, 경기, 부산...) |
| `recommend_stores` | StoreItem[] | 추천 숙소 목록 |
| `item_buttons` | LinkItem[] | 상단 프로모 버튼 (무제한, 첫예약 등) |
| `new_item_categories` | LinkItem[] | 업종 카테고리 (모텔, 호텔·리조트, 펜션...) |
| `banners` | HomeBanner[] | 홈 배너 캐러셀 |
| `recent_stores` | StoreItem[] | 최근 본 숙소 (비회원: 빈 배열) |
| `exhibitions` | Exhibition[] | 기획전 목록 |
| `phrase` | string | 검색 문구 (랜덤 추천) |
| `valid_book_yn` | string | 예약 존재 여부 (`Y`/`N`) |
| `ai_magazines` | AiMagazineBanner[] | AI 매거진 배너 (nullable) |
| `popups` | Banner[] | 전면 팝업 (popup_notice_yn=Y 시) |

### 웹 컴포넌트 매핑

| 응답 필드 | 컴포넌트 |
|----------|---------|
| `banners` | `PromoBannerCarousel` |
| `new_item_categories` | `BusinessTypeGrid` |
| `item_buttons` | `PromoCards` |
| `exhibitions` | `FeatureSection` |
| `recommend_categories` + `recommend_stores` | `RegionRecommendations` |
| `recent_stores` | `RecentlyViewed` |
| `ai_magazines` | `MagazineSection` |
| `phrase` | `HeroSection` (검색 placeholder) |

---

## 2. POST /home/regionStores — 지역 추천 숙소 조회

지역 탭 전환 시 해당 지역의 추천 숙소만 갱신한다.

### Request Body

| 필드 | 타입 | 필수 | 설명 | 기본값 |
|------|------|:----:|------|--------|
| `region_code` | string | O | 최상위 지역 코드 | |
| `convenience_codes` | string | - | 편의시설 코드 (콤마 구분) | |

### Response (`result`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `recommend_categories` | RegionCategory[] | 지역 카테고리 목록 (home/main과 동일) |
| `recommend_stores` | StoreItem[] | 해당 지역 추천 숙소 |

---

## 공통 타입

### RegionCategory
```json
{
  "type": "R001",
  "view_type": "LIST",
  "open_yn": "Y",
  "code": "ALL_01",
  "name": "서울",
  "depth": 0,
  "priority": 0
}
```

### StoreItem
```json
{
  "key": "D_KCST_20240411193926_a1c5f5",
  "filter_bit": 0,
  "name": "숙소명",
  "like_count": 10,
  "consecutive_yn": "N",
  "user_like_yn": "N",
  "parking_yn": "N",
  "point_reward_type": "ORDER",
  "images": [
    { "key": 61, "description": "대표 이미지", "url": "https://...", "thumb_url": "https://...", "priority": 0 }
  ],
  "items": [
    {
      "key": "D_KCIP_...",
      "price": 20000,
      "discount_price": 20000,
      "name": "객실명",
      "category": { "code": "010102", "name": "숙박" },
      "coupons": [ { "coupon_pk": 39301, "discount_amount": 3000, "title": "선착순 쿠폰", ... } ],
      "daily_extras": [ { "date": "20260326", "extras": [ { "code": "PRICE", "value": "20000" } ] } ]
    }
  ],
  "extra_services": []
}
```

### HomeBanner
```json
{
  "key": 12398,
  "view_count": 0,
  "image_urls": ["https://..."],
  "link": { "type": "APP_LINK", "sub_type": "A_CR_03", "target": "", "btn_name": "" },
  "reg_dt": 1668574207
}
```

### Exhibition
```json
{
  "key": 87284,
  "type": "PACKAGE_EXHIBITION_GROUP",
  "title": "기획전 제목",
  "description": "기획전 설명",
  "badge_image_url": "https://...",
  "banner_image_url": "https://...",
  "detail_banner_image_url": "https://...",
  "image_urls": ["https://..."],
  "reg_dt": 1765931803,
  "start_dt": 1765897200,
  "end_dt": 1774969199
}
```

### LinkItem (item_buttons / new_item_categories)
```json
{
  "type": "APP_LINK",
  "sub_type": "A_CA_03",
  "target": "MOTEL",
  "btn_name": "모텔",
  "thumb_url": "https://...",
  "bg_url": "https://...",
  "bg_color": "#355555",
  "title_color": "#111111",
  "mapping_business_types": ["MOTEL", "GUESTHOUSE"]
}
```

---

## 지역 코드 목록 (region_code)

| 코드 | 지역 |
|------|------|
| `ALL_0100000` | 강남/역삼/삼성/논현 (기본값) |
| `ALL_01` | 서울 |
| `ALL_02` | 경기 |
| `ALL_03` | 부산 |
| `ALL_04` | 대구/경산 |
| `ALL_05` | 인천 |
| `ALL_06` | 광주 |
| `ALL_07` | 대전 |
| `ALL_08` | 울산 |
| `ALL_09` | 충남/세종 |
| `ALL_10` | 강원 |
| `ALL_11` | 충북 |
| `ALL_12` | 전북 |
| `ALL_13` | 전남 |
| `ALL_14` | 경북 |
| `ALL_15` | 경남 |
| `ALL_16` | 제주 |
