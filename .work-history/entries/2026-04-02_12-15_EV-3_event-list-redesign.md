## EV-3: EventListPage 재설계

**브랜치:** `feat/event-ui-improvement`

### 변경 사항
- "전체" 탭에도 카운트 표시 (10)
- "종료" 중복 표시 제거: 그리드 카드에서 이미지 오버레이만 남기고 하단 status dot 제거
- 그리드 카드 이미지 aspect 4:3 → 16:10 (배너형 이미지 맞춤)
- thumb_description 노출 추가
- StatusBadge 컴포넌트 통합 (pill 스타일, 아이콘 포함)
- 조회수 이미지 위 배치로 이동 (피처드 카드에서도 우상단)
- detail_banner_image_url을 이미지 소스 1순위로 변경

### 개선 효과
- Before: 종료 카드에 "종료" 2번 표시 → After: 이미지 오버레이 1번만
- Before: 전체 탭 카운트 없음 → After: 모든 탭에 카운트
- Before: 4:3 비율에 배너 잘림 → After: 16:10 가로형으로 배너 텍스트 가시성 향상
