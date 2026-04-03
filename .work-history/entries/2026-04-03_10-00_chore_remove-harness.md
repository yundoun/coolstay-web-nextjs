# Claude Agent SDK 하네스 삭제

## 작업 내용
- `harness/` 디렉토리 전체 삭제 (3-Agent 파이프라인)
- `scripts/setup-harness.sh` 삭제
- `.gitignore`에서 harness 관련 항목 제거

## 삭제 사유
- 기존 코드베이스 위에서 UI 재설계 시 토큰 소모 과다
- 디자인 레퍼런스 없이 Generator가 기존 패턴을 답습 → AI 슬럽 품질
- 비용 대비 퀄리티 부족으로 운용 중단 결정
