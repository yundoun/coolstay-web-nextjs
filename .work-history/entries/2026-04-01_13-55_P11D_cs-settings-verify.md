# Phase 11-D — CS/설정/기타 API 검증

## API 호출 결과 (9/11 검증)
- GET /auth/alarms/users/list → link가 객체, alarm_categories 필드 존재
- GET /manage/board/list?board_type=NOTICE → key/view_count/title/reg_dt만 반환
- GET /manage/board/list?board_type=FAQ → type 필드에 카테고리명("마일리지")
- GET /manage/board/list?board_type=INQUIRY → 에러 (권한?)
- GET /auth/users/settings/list → 코드가 US002/US003/US007
- GET /manage/terms/list → 정상 (기존 타입과 일치)
- GET /auth/users/friend/list → button 구조 변경, update_dt는 number

## 타입 수정
- Alarm: link string→AlarmLink 객체, alarm_categories 추가
- NotificationPage: alarm.link?.target 접근 수정
- SettingsPage: EMAIL/SMS/MARKETING → US002/US003/US007
- Friend: FriendEvent/FriendButton 타입 신규, update_dt number
- cs.md, contents.md 실제 응답 반영
