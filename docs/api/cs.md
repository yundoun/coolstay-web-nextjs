# CS / Alarm API 명세서

> **도메인**: 알림, 공지사항, FAQ, 1:1 문의
> **Base Path**: `/api/v2/mobile`
> **공통 헤더**: `app-token`, `app-secret-code`
> **작성일**: 2026-03-31

---

## 목차

1. [알림 목록 조회](#1-알림-목록-조회)
2. [알림 삭제](#2-알림-삭제)
3. [알림카드 상태 변경](#3-알림카드-상태-변경)
4. [공지사항](#4-공지사항)
5. [FAQ](#5-faq)
6. [1:1 문의](#6-11-문의)

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
  "total_count": 3,
  "next_cursor": "abc",
  "alarms": [
    {
      "key": 1,
      "type": "BOOKING",
      "title": "예약이 확정되었습니다",
      "description": "도운텔2 스탠다드",
      "summary": "3월 31일 체크인",
      "read_yn": "N",
      "link": "/bookings/123",
      "image": "https://...",
      "reg_dt": 1711843200,
      "category_code": "BOOKING"
    }
  ]
}
```

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

### 응답

```json
{
  "total_count": 10,
  "next_cursor": "abc",
  "board_items": [
    {
      "key": "notice-1",
      "type": "NOTICE",
      "title": "서비스 점검 안내",
      "description": "3월 31일 02:00~04:00 서버 점검",
      "status": "ACTIVE",
      "view_count": 150
    }
  ]
}
```

### 연동 파일

- API: `src/domains/cs/api/csApi.ts` → `getNoticeList()`

---

## 5. FAQ

```
GET /manage/board/list?board_type=FAQ
```

공지사항과 동일 구조, `board_type=FAQ`로 호출.

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

## 테스트 현황

| API | 테스트 파일 | Cases |
|-----|------------|-------|
| Alarm (P3-1~3) | `src/domains/alarm/api/__tests__/alarmApi.test.ts` | 4 |
| CS (P3-4~6) | `src/domains/cs/api/__tests__/csApi.test.ts` | 6 |
