# 예약 목록 API 응답 매핑 수정 [ISSUE-2]

## 문제
BookItem 타입이 camelCase로 정의되어 있으나 실제 API 응답은 snake_case.
또한 category 필드가 string이 아닌 { code, name } 객체.

## 수정
- BookItem, BookListResponse 등 타입을 실제 API 응답(snake_case)으로 변경
- toBookingHistoryItem, toBookingDetail 매핑 함수 수정
- inferBookingType에서 category 객체 처리
- useBookingList에서 total_count, next_cursor 참조 수정
