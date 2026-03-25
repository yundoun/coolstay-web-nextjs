# [INFRA-0] CLAUDE.md 및 태스크 스크립트 일반화

## 작업 내용
- CLAUDE.md에서 android-alignment 브랜치 특정 내용 제거
- 범용 TASKS.md 관리 가이드 작성 (자유 형식 태스크 ID, ### 섹션 그룹핑)
- task-status.sh: Phase 1~4 하드코딩 → ### 섹션 헤더 자동 감지
- complete-task.sh: Phase 매핑 템플릿 → 섹션 자동 탐지
- update-task-progress.sh: P1~P4 패턴 → 범용 체크박스 패턴, 섹션별 통계

## 변경 파일
- CLAUDE.md
- scripts/complete-task.sh
- scripts/task-status.sh
- scripts/update-task-progress.sh
