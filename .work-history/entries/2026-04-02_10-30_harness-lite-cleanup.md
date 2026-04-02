# 하네스 Lite 모드 추가 + 파생 파일 정리

## 작업 내용
- 3-Agent 하네스 Lite 모드 추가 (Planner/Contract 생략, $2~4 예상 비용)
- Full 모드 Evaluator 개선: maxTurns 30→60, browser_snapshot 제거, 효율 규칙 추가
- 하네스 테스트가 수정한 src/ 파일 10개 원복
- .playwright-mcp/ 170개 파일 git tracking 제거 + 삭제
- .gitignore에 파생 파일 패턴 추가

## 변경 파일
- harness/src/orchestrator-lite.ts (신규)
- harness/src/agents/generator.ts (lite 파라미터)
- harness/src/agents/evaluator.ts (lite 파라미터, maxTurns, allowedTools)
- harness/prompts/evaluator.md (효율 규칙)
- harness/package.json (harness:lite 스크립트)
- harness/RESUME.md (두 모드 가이드)
- .gitignore (파생 파일 패턴)
