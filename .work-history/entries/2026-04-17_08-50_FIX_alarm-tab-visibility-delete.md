# 알림 카테고리 탭 가시성 및 전체삭제 버그 수정

## 작업 내용

### 1. 카테고리 탭 텍스트 미표시 수정
- API 응답의 `alarm_categories`가 `{ code, name }` 이 아닌 `{ code, value }` 구조
- `value`는 알림 존재 여부("Y"/"N")이며, 표시할 레이블이 없음
- `CATEGORY_LABELS` 매핑 추가 (ALL→전체, RESERVATION→예약, BENEFIT→혜택, EVENT→이벤트, ACTIVITY→활동)
- API가 `code: "ALL"` 포함하므로 하드코딩된 "전체" 버튼 제거, 단일 루프로 통합

### 2. 전체삭제 시 로그아웃 버그 수정
- 원인: API 스펙과 코드의 파라미터 불일치 → 서버 에러 → 토큰 에러로 오인 → 로그아웃
- `delete_type`: `"ALL"` → `"CARDS_A"` (스펙 정의값)
- `category`: 미전송 → 현재 카테고리 전달 (필수 파라미터)
- `alarm_key` → `alarm_keys` (복수형)

### 3. 알림 카드 링크 제거
- 미작동하는 페이지 이동 링크/CTA 버튼 제거
- 불필요한 import 정리 (Link, ExternalLink)

## 수정 파일
- `src/domains/alarm/types/index.ts`
- `src/domains/notification/components/NotificationPage.tsx`
