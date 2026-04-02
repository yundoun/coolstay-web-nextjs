## EV-2: 홈 EventSection 재설계

**브랜치:** `feat/event-ui-improvement`

### 변경 사항
- 종료 이벤트를 홈에서 제거 → 진행중/예정만 노출
- 이벤트 1개일 때 풀너비 피처드 카드 (aspect 2.2:1), 2개 이상이면 캐러셀 (16:9)
- 중복 헤더(빈 div + 전체보기) 제거 → 하단 "전체 이벤트 보기" 링크
- 이미지 없는 카드 fallback 강화 (상태별 그라데이션 배경 + 제목 텍스트)
- 상태 배지에 아이콘 추가 (Sparkles/Clock)
- 조회수, thumb_description 노출 추가
- 카드 크기 280/320px, border + 하단 텍스트 영역 분리
- 공통 컴포넌트 분리: StatusBadge, ViewCount, EventImageFallback

### 개선 효과
- Before: 깨진 이미지 + 종료 이벤트로 "죽은 섹션" → After: 진행중 이벤트만 피처드 표시
- Before: 세로형 3:4 카드에 배너 잘림 → After: 가로형 16:9/2.2:1 배너 정상 표시
