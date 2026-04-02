/**
 * Lite Orchestrator — 소규모 수정용 경량 파이프라인
 *
 * Planner/Contract 생략. Generator → Evaluator 1회 루프.
 * 예상 비용: $2~4 / 예상 시간: 5~10분
 *
 * Usage: pnpm harness:lite "숙소 카드 hover 효과 개선"
 */
import { runGenerator } from "./agents/generator.js";
import { runEvaluator } from "./agents/evaluator.js";
import { allCriteriaPassed } from "./criteria/index.js";
import { saveReport } from "./utils/report.js";
import type {
  RunReport,
  SprintReport,
  IterationReport,
  CriteriaScores,
} from "./utils/report.js";

// ── 설정 ──────────────────────────────────────────────
const MAX_ITERATIONS = 2; // Lite: 최대 2회 반복
const DEV_SERVER_URL = "http://localhost:3000";

// ── Lite Contract 생성 (LLM 호출 없이 프롬프트에서 직접) ──
function buildLiteContract(userPrompt: string): string {
  return `
# Sprint: Lite Task

## 구현 범위
- ${userPrompt}

## 완료 기준
1. 사용자 요청사항이 정상적으로 구현됨
2. 기존 기능이 깨지지 않음
3. 코드가 프로젝트 컨벤션을 따름

## 테스트 시나리오
1. 해당 페이지에 접근하여 변경사항이 반영되었는지 확인
2. 주요 인터랙션이 정상 작동하는지 확인

## 제외 범위
- 요청 범위 외의 리팩토링이나 개선
`;
}

// ── 메인 ──────────────────────────────────────────────
async function main() {
  const userPrompt = process.argv[2];
  if (!userPrompt) {
    console.error('Usage: pnpm harness:lite "<프롬프트>"');
    console.error('Example: pnpm harness:lite "숙소 카드 hover 효과 개선"');
    process.exit(1);
  }

  const startedAt = new Date().toISOString();
  let totalCostUsd = 0;

  console.log("╔══════════════════════════════════════════╗");
  console.log("║   3-Agent Harness LITE — CoolStay Web   ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\nPrompt: "${userPrompt}"\n`);

  // ── Contract (즉시 생성, LLM 호출 없음) ──
  const contract = buildLiteContract(userPrompt);
  console.log("▸ Contract 즉시 생성 (LLM 생략)");

  // ── Generator ↔ Evaluator 루프 ──
  const iterations: IterationReport[] = [];
  let lastFeedback = "";
  let sprintPassed = false;
  let finalScores: CriteriaScores = {
    designQuality: 0,
    originality: 0,
    craft: 0,
    functionality: 0,
    weighted: 0,
  };

  for (let round = 1; round <= MAX_ITERATIONS; round++) {
    console.log(`\n▸ Round ${round}/${MAX_ITERATIONS}`);

    // Generator (Lite 설정)
    console.log("  ├─ Generator 구현 중...");
    const genResult = await runGenerator({
      contract,
      spec: userPrompt, // Lite: 스펙 = 프롬프트 그대로
      previousFeedback: round > 1 ? lastFeedback : undefined,
      iterationRound: round > 1 ? round : undefined,
      lite: true,
    });
    totalCostUsd += genResult.costUsd;
    console.log(
      `  ├─ 구현 완료 ($${genResult.costUsd.toFixed(2)} / ${(genResult.durationMs / 1000).toFixed(0)}s)`,
    );

    // Evaluator (Lite 설정)
    console.log("  ├─ Evaluator 평가 중...");
    const evalResult = await runEvaluator({
      contract,
      handoff: genResult.handoff,
      targetUrl: DEV_SERVER_URL,
      iterationRound: round,
      lite: true,
    });
    totalCostUsd += evalResult.costUsd;
    finalScores = evalResult.scores;
    lastFeedback = evalResult.feedback;

    const iterReport: IterationReport = {
      round,
      scores: evalResult.scores,
      passed: evalResult.passed,
      feedback: evalResult.feedback,
      durationMs: genResult.durationMs + evalResult.durationMs,
      costUsd: genResult.costUsd + evalResult.costUsd,
    };
    iterations.push(iterReport);

    console.log(
      `  ├─ 점수: D=${evalResult.scores.designQuality} O=${evalResult.scores.originality} C=${evalResult.scores.craft} F=${evalResult.scores.functionality} → ${evalResult.scores.weighted.toFixed(1)}`,
    );
    console.log(
      `  └─ ${evalResult.passed ? "✓ PASS" : "✗ FAIL — 피드백 전달 후 재시도"}`,
    );

    if (evalResult.passed) {
      sprintPassed = true;
      break;
    }
  }

  // ── Report ─────────────────────────────────
  const completedAt = new Date().toISOString();
  const totalDurationMs = Date.now() - new Date(startedAt).getTime();

  const report: RunReport = {
    prompt: userPrompt,
    startedAt,
    completedAt,
    totalDurationMs,
    totalCostUsd,
    sprints: [
      {
        sprintIndex: 0,
        contractFile: "(lite — inline)",
        iterations,
        finalScores,
        passed: sprintPassed,
      },
    ],
    finalVerdict: sprintPassed ? "pass" : "fail",
  };

  const reportPath = saveReport(report);

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║           Lite Run Complete              ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(
    `║  Duration: ${(totalDurationMs / 1000 / 60).toFixed(1)} min`.padEnd(43) +
      "║",
  );
  console.log(
    `║  Cost:     $${totalCostUsd.toFixed(2)}`.padEnd(43) + "║",
  );
  console.log(
    `║  Verdict:  ${report.finalVerdict.toUpperCase()}`.padEnd(43) + "║",
  );
  console.log(
    `║  Report:   ${reportPath}`.padEnd(43) + "║",
  );
  console.log("╚══════════════════════════════════════════╝");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
