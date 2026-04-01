# Contents / Settings API 명세서

> **도메인**: 설정, 이벤트/기획전, 약관, 친구추천
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code`
> **최종 업데이트**: 2026-04-01 (dev 서버 실제 응답 기준)

---

## 1. 설정

### 1-1. 설정 목록 조회

```
GET /auth/users/settings/list
```

#### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "settings": [
    { "code": "US002", "value": "Y" },
    { "code": "US003", "value": "Y" },
    { "code": "US007", "value": "Y" }
  ]
}
```

> **설정 코드 매핑**:
> - `US002` — 푸시 알림 수신
> - `US003` — 마케팅 정보 수신 동의
> - `US007` — 야간 알림 수신 (21시~08시)

### 1-2. 설정 변경

```
POST /auth/users/settings/update
```

```json
{ "settings": [{ "code": "US002", "value": "N" }] }
```

### 연동 파일

- 타입: `src/domains/settings/types/index.ts`
- API: `src/domains/settings/api/settingsApi.ts`

---

## 2. 이벤트/기획전

> 2026-04-01 dev 서버 실제 응답 확인. `board_type=EVENT`로 `/manage/board/list` 호출.

```
GET /manage/board/list?board_type=EVENT
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `board_type` | string | O | `EVENT` 고정 |
| `status` | string | - | 상태 필터 |
| `count` | number | - | 요청 개수 |
| `cursor` | string | - | 페이지네이션 커서 |

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "total_count": "114",
  "next_cursor": "1763438154310",
  "board_items": [
    {
      "key": 87226,
      "view_count": 0,
      "type": "VISIT",
      "title": "2025 숙박세일 페스타[가을/겨울편]",
      "description": ".",
      "badge_image_url": "https://storage.googleapis.com/coolstay-dev/v2/thumb/.../badge.png",
      "detail_banner_image_url": "https://storage.googleapis.com/coolstay-dev/v2/thumb/.../detail.png",
      "webview_link": "http://ggulstay.co.kr/event/assf/202508/event.html",
      "image_urls": [
        "https://storage.googleapis.com/coolstay-dev/v2/admin/.../img1.png",
        "https://storage.googleapis.com/coolstay-dev/v2/admin/.../img2.png"
      ],
      "link": {
        "type": "APP_LINK",
        "sub_type": "A_MR_24",
        "target": "87145",
        "btn_name": ""
      },
      "buttons": [
        {
          "type": "URL_DETAIL",
          "sub_type": "1",
          "target": "http://ggulstay.co.kr/event/assf/202508/event.html",
          "btn_name": "쿠폰 받으러가기"
        }
      ],
      "reg_dt": 1755740493,
      "start_dt": 1755736200,
      "end_dt": 1787871659
    },
    {
      "key": 87270,
      "view_count": 0,
      "type": "COUPON",
      "title": "기획전 목록",
      "description": "<p>ㅁㄴㅇㄹ기획전 목록</p>",
      "badge_image_url": "https://...",
      "detail_banner_image_url": "https://...",
      "status": "BI005",
      "thumb_description": "기획전 목록",
      "image_urls": ["https://...", "https://..."],
      "link": {
        "type": "APP_LINK",
        "sub_type": "A_CR_01",
        "target": "",
        "btn_name": ""
      },
      "reg_dt": 1764810254,
      "start_dt": 1764774000,
      "end_dt": 1767193199
    }
  ]
}
```

### 이벤트에서 반환되는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | number | 이벤트 ID |
| `type` | string | `"VISIT"`, `"COUPON"` 등 이벤트 유형 |
| `title` | string | 제목 |
| `description` | string | 본문 (HTML 포함 가능: `<p>...</p>`) |
| `badge_image_url` | string | 목록 썸네일 이미지 |
| `detail_banner_image_url` | string | 상세 히어로 이미지 |
| `webview_link` | string | 웹뷰 링크 (일부 항목만) |
| `image_urls` | string[] | 상세 이미지 목록 |
| `link` | BoardItemLink | CTA 링크 객체 |
| `buttons` | BoardItemLink[] | CTA 버튼 배열 (일부 항목만) |
| `thumb_description` | string | 목록 부제 (일부 항목만) |
| `status` | string | 상태 코드 (`"BI005"` 등 — 불투명 코드) |
| `view_count` | number | 조회수 |
| `start_dt` | number | 시작일 (초 단위 timestamp) |
| `end_dt` | number | 종료일 (초 단위 timestamp) |
| `reg_dt` | number | 등록일 (초 단위 timestamp) |

> **주의**:
> - `banner_image_url` 필드는 반환되지 않음 → `badge_image_url` 사용
> - `status`는 `"ACTIVE"` / `"END"` 가 아닌 코드값 (`"BI005"`) → 날짜 기반 판단 필요
> - `description`에 HTML 태그가 포함될 수 있음
> - 타임스탬프는 **초 단위**: `new Date(value * 1000)` 변환 필요

### 연동 파일

- 타입: `src/domains/cs/types/index.ts` → `BoardItem` (공통), `src/domains/event/types/index.ts`
- API: `src/domains/event/api/eventApi.ts` → `getEventList()`
- 컴포넌트: `src/domains/event/components/EventListPage.tsx`

---

## 3. 약관

```
GET /manage/terms/list
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `term_code` | string | - | 특정 약관 코드 |

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "terms": [
    {
      "code": "TC001",
      "name": "모바일 서비스 이용약관",
      "url": "https://...",
      "required_yn": "Y",
      "version": "00.00.01"
    }
  ]
}
```

### 연동 파일

- 타입: `src/domains/terms/types/index.ts`
- API: `src/domains/terms/api/termsApi.ts`

---

## 4. 친구추천

### 4-1. 추천 정보 조회

```
GET /auth/users/friend/list
```

#### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "friend_event": {
    "view_count": 0,
    "image_urls": ["https://..."]
  },
  "friend_info": {
    "reg_user_count": 0,
    "my_recommend_code": "FY5AEAXH",
    "image_url": "https://...",
    "update_dt": 1775018849,
    "ranking_visible_yn": false
  },
  "button": {
    "type": "APP_LINK",
    "sub_type": "A_AF_02",
    "target": "",
    "btn_name": "카톡테스트",
    "thumb_url": "https://..."
  }
}
```

### 4-2. 추천 코드 등록

```
POST /auth/users/friend/register
```

```json
{ "recommend_code": "XYZ789" }
```

### 연동 파일

- 타입: `src/domains/friend/types/index.ts`
- API: `src/domains/friend/api/friendApi.ts`

---

## 테스트 현황

| API | 테스트 파일 | Cases |
|-----|------------|-------|
| Settings (P4-1~2) | `src/domains/settings/api/__tests__/settingsApi.test.ts` | 2 |
| Event (P10-B) | `src/domains/event/components/__tests__/EventListPage.test.tsx` | 18 |
| Terms (P4-5) | `src/domains/terms/api/__tests__/termsApi.test.ts` | 2 |
| Friend (P4-6) | `src/domains/friend/api/__tests__/friendApi.test.ts` | 2 |
