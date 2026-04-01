# 기획전 상세 페이지 라우트 분리

## 작업 내용
- `/events/[id]` 상세 페이지 라우트 생성
- EventDetailPage 컴포넌트 분리 (EventListPage에서 상세 UI 제거)
- getEventDetail() API 함수 추가 (board_type=EVENT&board_item_key)
- useEventDetail() React Query 훅 추가
- EventListPage 카드 → Link 컴포넌트로 전환 (useState 제거)
- eventApi 엔드포인트 /manage/event/list → /manage/board/list 통일
- 공유 버튼 (navigator.share/clipboard) 추가
- 테스트 업데이트 (API 테스트 3 + 목록 테스트 11)

## 변경 파일
- 신규: src/app/(public)/events/[id]/page.tsx
- 신규: src/domains/event/components/EventDetailPage.tsx
- 신규: src/domains/event/hooks/useEventDetail.ts
- 수정: src/domains/event/api/eventApi.ts
- 수정: src/domains/event/hooks/useEventList.ts
- 수정: src/domains/event/components/EventListPage.tsx
- 수정: src/domains/event/types/index.ts
