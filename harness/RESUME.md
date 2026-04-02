# Harness 실행 가이드

## 두 가지 모드

### Lite 모드 — 소규모 수정 ($2~4, 5~10분)
```bash
pnpm harness:lite "숙소 카드 hover 효과 개선"
```
- Planner/Contract 협상 생략
- Generator: maxTurns 50, budget $5
- Evaluator: maxTurns 20, budget $3
- 최대 2회 반복

### Full 모드 — 대규모 리디자인 ($8~15, 20~40분)
```bash
pnpm harness "헤더 디자인과 페이지별 헤더를 사용자 경험이 뛰어나도록 리디자인"
```
- 전체 파이프라인: Planner → Contract 협상 → Generator ↔ Evaluator
- Generator: maxTurns 100, budget $30
- Evaluator: maxTurns 60, budget $10
- 최대 3회 반복 × 스프린트 수

## v0.2 변경사항 (2026-04-02)

### 문제
- Evaluator가 Playwright MCP 호출로 30턴 한도 초과 (Sprint 2-3 전부 FAIL)
- 소규모 수정에 Full 파이프라인 비용 과다

### 수정
1. **Lite 모드 추가** — Planner/Contract 생략, 경량 설정
2. **Evaluator maxTurns**: 30 → 60 (Full), 20 (Lite)
3. **Evaluator 프롬프트 최적화** — 효율 규칙 추가, 불필요한 탐색 제거
4. **browser_snapshot 제거** — screenshot만 사용하도록 변경
5. **Generator Lite**: maxTurns 50, budget $5

## 실행 전 확인사항
```bash
# dev 서버 실행 확인
curl -s http://localhost:3000

# 하네스 실행 (Lite)
cd harness && pnpm harness:lite "작업 내용"

# 하네스 실행 (Full)
cd harness && pnpm harness "작업 내용"
```
