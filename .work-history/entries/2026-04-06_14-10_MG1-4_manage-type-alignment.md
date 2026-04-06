# MANAGE MG-1~4 타입 정렬 + API 추가

## 변경 요약

### MG-1: 타입 정렬 (CRITICAL)
- board_type: "INQUIRY" → "ASK" 전체 수정 (csApi, InquiryPage, 테스트)
- BoardItem: 기획전 필드 추가 (linked_stores, v2_pull_coupons, v2_total_coupons, default_sort_type 등)
- BoardItemReply: key, user 필드 추가 (스펙 ReplyItem 일치)
- BoardListResponse.total_count: number | string → number 통일

### MG-2: UI 갭 분석
- ui-binding.md 기준 전체 바인딩 체크 완료
- 공지/FAQ/이벤트/기획전/1:1문의/인기검색어 바인딩 확인

### MG-3: 기획전 상세 API
- getExhibitionDetail() 추가

### MG-4: 인기 검색어 API
- getPopularKeywords() + PopularKeywordResponse/PopularKeywordItem 타입 추가

## 테스트
- TypeScript 컴파일 에러 없음
- 132 tests passed
