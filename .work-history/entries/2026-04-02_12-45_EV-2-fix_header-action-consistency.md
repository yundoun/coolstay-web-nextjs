## EV-2 수정: 전체보기 링크 위치 — 기존 패턴 일관성 적용

**브랜치:** `feat/event-ui-improvement`

### 문제
- 이벤트 섹션 "전체보기" 링크를 카드 하단에 배치
- 기획전 섹션은 Section의 `headerAction`으로 헤더 우측에 배치하는 기존 패턴이 있음
- 이유 없이 다른 패턴을 적용 → 일관성 위반

### 수정
- EventSection 내부의 MoreEventsLink 함수 제거
- 홈 page.tsx에서 Section의 `headerAction`에 "전체보기" 링크 배치
- 기획전 섹션과 동일한 패턴으로 통일
