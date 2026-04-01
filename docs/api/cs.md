# CS / Alarm API 명세서

> **도메인**: 알림, 공지사항, FAQ, 1:1 문의, 꿀팁 가이드
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code`
> **최종 업데이트**: 2026-04-01 (dev 서버 실제 응답 기준)

---

## 목차

1. [알림 목록 조회](#1-알림-목록-조회)
2. [알림 삭제](#2-알림-삭제)
3. [알림카드 상태 변경](#3-알림카드-상태-변경)
4. [공지사항](#4-공지사항)
5. [FAQ](#5-faq)
6. [1:1 문의](#6-11-문의)
7. [꿀팁 가이드](#7-꿀팁-가이드)

---

## 공통: BoardItem 타입

> 공지/FAQ/문의/가이드/이벤트 모두 `board_items[]` 배열로 반환되며, 아래 구조를 공유합니다.
> board_type에 따라 반환되는 필드가 다릅니다.

```typescript
interface BoardItemLink {
  type: string       // "APP_LINK" | "URL" | "URL_DETAIL"
  sub_type: string   // "A_MR_24" 등
  target: string     // 링크 대상 (URL 또는 ID)
  btn_name: string   // 버튼 텍스트
}

interface BoardItem {
  key: number                         // 항목 고유 ID (number)
  type?: string                       // "NOTICE" | "FAQ" | "GUIDE" | "VISIT" | "COUPON" 등
  title: string
  description?: string                // 본문 (HTML 포함 가능)
  badge_image_url?: string            // 뱃지/목록 썸네일 이미지
  detail_banner_image_url?: string    // 상세 히어로 이미지
  image_urls?: string[]               // 상세 이미지 목록 (string[])
  webview_link?: string               // 웹뷰 링크
  link?: BoardItemLink                // CTA 링크 객체
  buttons?: BoardItemLink[]           // CTA 버튼 배열 (이벤트 등)
  thumb_description?: string          // 목록 부제
  view_count?: number                 // 조회수
  status?: string                     // 상태 코드 ("BI005" 등)
  start_dt?: number                   // 게시 시작일 (초 단위 timestamp)
  end_dt?: number                     // 게시 종료일 (초 단위 timestamp)
  reg_dt?: number                     // 등록일 (초 단위 timestamp)
  tags?: string[]
  reply?: { text: string; reg_dt: number }
  reply_count?: number
  position?: number                   // 정렬 순서
}
```

**⚠️ 타임스탬프는 초 단위**: `1727399964` (초) → `new Date(value * 1000)`으로 변환 필요

---

## 1. 알림 목록 조회

> Swagger 미등록 — AOS `CoolStayAPIInterfaceV2.kt` → `getAlarmMessages()` 에서 확인

```
GET /auth/alarms/users/list
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `category` | string | - | 알림 카테고리 필터 |
| `count` | number | - | 요청 개수 |
| `cursor` | string | - | 페이지네이션 커서 |

### 응답

```json
{
  "total_count": 2,
  "next_cursor": "...",
  "alarm_categories": [
    { "code": "BENEFIT", "name": "혜택" }
  ],
  "alarms": [
    {
      "key": 36448,
      "title": "마일리지 적립 안내",
      "summary": "마일리지가 440원 적립되었습니다...",
      "read_yn": "N",
      "category_code": "BENEFIT",
      "link": {
        "type": "APP_LINK",
        "sub_type": "A_MR_09",
        "target": "0",
        "btn_name": "내 마일리지"
      },
      "reg_dt": 1775016300
    }
  ]
}
```

> **주의**:
> - `link`는 **객체** (BoardItemLink와 동일 구조) — 문자열이 아님
> - `alarm_categories`로 카테고리 탭 목록 제공
> - `description`, `type`, `image` 필드는 실제 응답에서 미확인 (optional)

### 연동 파일

- 타입: `src/domains/alarm/types/index.ts` → `AlarmListParams`, `AlarmListResponse`
- API: `src/domains/alarm/api/alarmApi.ts` → `getAlarmList()`

---

## 2. 알림 삭제

```
POST /auth/alarms/delete
```

### 요청

```json
{
  "category": "BOOKING",
  "delete_type": "SELECT",
  "alarm_key": [1, 2, 3]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `category` | string | - | 카테고리 필터 |
| `delete_type` | string | O | 삭제 유형 (SELECT, ALL 등) |
| `alarm_key` | number[] | O | 삭제 대상 알림 키 배열 |

### 연동 파일

- 타입: `src/domains/alarm/types/index.ts` → `AlarmDeleteRequest`
- API: `src/domains/alarm/api/alarmApi.ts` → `deleteAlarms()`

---

## 3. 알림카드 상태 변경

읽음 처리 등 알림 상태 변경

```
POST /auth/alarms/card/update
```

### 요청

```json
{
  "type": "READ",
  "alarm_key": [1, 2, 3]
}
```

### 연동 파일

- 타입: `src/domains/alarm/types/index.ts` → `AlarmCardUpdateRequest`
- API: `src/domains/alarm/api/alarmApi.ts` → `updateAlarmCard()`

---

## 4. 공지사항

`/manage/board/list`를 `board_type=NOTICE`로 호출

```
GET /manage/board/list?board_type=NOTICE
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `board_type` | string | O | `NOTICE` 고정 |
| `status` | string | - | 상태 필터 |
| `count` | number | - | 요청 개수 |
| `board_item_key` | string | - | 특정 공지 조회 (상세) |
| `cursor` | string | - | 페이지네이션 커서 |

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "total_count": "...",
  "next_cursor": "...",
  "board_items": [
    {
      "key": 13322,
      "view_count": 0,
      "title": "testestestestestestestset",
      "reg_dt": 1772689506
    }
  ]
}
```

> **주의**: 공지사항 목록에서는 `key`, `view_count`, `title`, `reg_dt`만 반환됨.
> `description`, `status`, `type` 등은 목록 조회에서 포함되지 않음 (상세 조회 시 반환 가능)

### 연동 파일

- 타입: `src/domains/cs/types/index.ts` → `BoardItem`, `BoardListResponse`
- API: `src/domains/cs/api/csApi.ts` → `getNoticeList()`

---

## 5. FAQ

```
GET /manage/board/list?board_type=FAQ
```

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "board_items": [
    {
      "key": 13177,
      "view_count": 0,
      "type": "마일리지",
      "title": "정산 FAQ...",
      "reg_dt": 1701649780
    }
  ]
}
```

> **주의**: FAQ 목록에서는 `type`(카테고리명, 예: "마일리지")이 포함됨. 공지사항과 달리 `type` 필드가 존재.

### 연동 파일

- API: `src/domains/cs/api/csApi.ts` → `getFaqList()`

---

## 6. 1:1 문의

### 6-1. 문의 목록 조회

```
GET /manage/board/list?board_type=INQUIRY
```

### 6-2. 문의 등록

```
POST /manage/board/register
```

```json
{
  "board_type": "INQUIRY",
  "title": "문의합니다",
  "option_value": "예약 관련",
  "images": [{ "url": "https://...", "key": "file-key" }]
}
```

### 6-3. 문의 삭제

```
POST /manage/board/delete
```

```json
{
  "board_type": "INQUIRY",
  "item_key": "inq-123"
}
```

### 연동 파일

- 타입: `src/domains/cs/types/index.ts`
- API: `src/domains/cs/api/csApi.ts` → `getInquiryList()`, `registerInquiry()`, `deleteInquiry()`

---

## 7. 꿀팁 가이드

> 2026-04-01 dev 서버 실제 응답 확인

```
GET /manage/board/list?board_type=GUIDE
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `board_type` | string | O | `GUIDE` 고정 |
| `count` | number | - | 요청 개수 (기본 10) |
| `cursor` | string | - | 페이지네이션 커서 |

### 실제 응답 (dev 서버 2026-04-01)

```json
{
  "total_count": "9",
  "next_cursor": "null",
  "board_items": [
    {
      "key": 13426,
      "view_count": 6,
      "title": "꿀팁222222",
      "image_urls": [
        "https://storage.googleapis.com/coolstay-dev/v2/admin/.../image1.jpg",
        "https://storage.googleapis.com/coolstay-dev/v2/admin/.../image2.png"
      ],
      "reg_dt": 1727399964
    },
    {
      "key": 13286,
      "view_count": 37,
      "title": "기노출상단버튼",
      "image_urls": [
        "https://storage.googleapis.com/coolstay-dev/v2/admin/.../image.jpeg"
      ],
      "link": {
        "type": "APP_LINK",
        "sub_type": "A_MR_07",
        "target": "",
        "btn_name": ""
      },
      "reg_dt": 1713163665
    },
    {
      "key": 12848,
      "view_count": 19,
      "title": "등록테스트",
      "image_urls": [
        "https://storage.googleapis.com/coolstay-dev/.../image1.jpg",
        "https://storage.googleapis.com/coolstay-dev/.../image2.jpg"
      ],
      "link": {
        "type": "APP_LINK",
        "sub_type": "A_MR_24",
        "target": "12848",
        "btn_name": "이벤트 상세"
      },
      "reg_dt": 1691384438
    }
  ]
}
```

### 가이드에서 반환되는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | number | 가이드 ID |
| `title` | string | 제목 |
| `image_urls` | string[] | 이미지 목록 |
| `view_count` | number | 조회수 |
| `reg_dt` | number | 등록일 (초 단위) |
| `link` | BoardItemLink | CTA 버튼 (일부 항목만) |

> **주의**: `description`, `banner_image_url`, `webview_link` 은 가이드에서 반환되지 않음

### 연동 파일

- 타입: `src/domains/cs/types/index.ts` → `BoardItem`, `BoardListResponse`
- API: `src/domains/cs/api/csApi.ts` → `getGuideList()`
- 컴포넌트: `src/domains/guide/components/GuidePage.tsx`

---

## 테스트 현황

| API | 테스트 파일 | Cases |
|-----|------------|-------|
| Alarm (P3-1~3) | `src/domains/alarm/api/__tests__/alarmApi.test.ts` | 4 |
| CS (P3-4~6) | `src/domains/cs/api/__tests__/csApi.test.ts` | 6 |
| Guide (P10-A) | `src/domains/guide/components/__tests__/GuidePage.test.tsx` | 10 |
