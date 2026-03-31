# Contents / Settings API 명세서

> **도메인**: 설정, 이벤트, 약관, 친구추천
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code`
> **작성일**: 2026-03-31

---

## 1. 설정

### 1-1. 설정 목록 조회

```
GET /auth/users/settings/list
```

#### 응답

```json
{
  "settings": [
    { "code": "PUSH", "value": "Y" },
    { "code": "MARKETING", "value": "N" }
  ]
}
```

### 1-2. 설정 변경

```
POST /auth/users/settings/update
```

```json
{ "settings": [{ "code": "PUSH", "value": "N" }] }
```

### 연동 파일

- 타입: `src/domains/settings/types/index.ts`
- API: `src/domains/settings/api/settingsApi.ts`

---

## 2. 이벤트/기획전

```
GET /manage/event/list
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `search_type` | string | - | 검색 유형 |
| `status` | string | - | 상태 필터 |
| `count` | number | - | 요청 개수 |
| `cursor` | string | - | 페이지네이션 커서 |

### 응답

```json
{
  "events": [
    {
      "key": "evt-1",
      "type": "EVENT",
      "title": "봄맞이 할인",
      "description": "최대 50% 할인",
      "banner_image_url": "https://...",
      "start_dt": 1711843200,
      "end_dt": 1714521600,
      "status": "ACTIVE"
    }
  ]
}
```

### 연동 파일

- 타입: `src/domains/event/types/index.ts`
- API: `src/domains/event/api/eventApi.ts`

---

## 3. 약관

```
GET /manage/terms/list
```

### 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `term_code` | string | - | 특정 약관 코드 |

### 응답

```json
{
  "terms": [
    {
      "code": "T100",
      "name": "이용약관",
      "url": "https://...",
      "required_yn": "Y",
      "version": "1.0"
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

#### 응답

```json
{
  "friend_event": null,
  "friend_info": {
    "reg_user_count": 5,
    "my_recommend_code": "ABC123",
    "update_dt": "2026-03-31",
    "image_url": "https://...",
    "ranking_visible_yn": true,
    "recommend_users": [
      { "nickname": "유저1", "rank": 1 }
    ]
  },
  "button": { "url": "/share", "text": "공유하기" }
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

## 5. 이용 가이드

AOS 앱/서버에 별도 API 없음. 정적 콘텐츠로 처리.

---

## 테스트 현황

| API | 테스트 파일 | Cases |
|-----|------------|-------|
| Settings (P4-1~2) | `src/domains/settings/api/__tests__/settingsApi.test.ts` | 2 |
| Event (P4-3) | `src/domains/event/api/__tests__/eventApi.test.ts` | 2 |
| Terms (P4-5) | `src/domains/terms/api/__tests__/termsApi.test.ts` | 2 |
| Friend (P4-6) | `src/domains/friend/api/__tests__/friendApi.test.ts` | 2 |
