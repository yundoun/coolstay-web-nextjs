/**
 * 3-Agent Harness Orchestrator
 *
 * Planner → (Sprint Loop: Contract 협상 → Generator → Evaluator 피드백 루프) → Report
 *
 * Usage: pnpm harness "숙소 상세 페이지 리디자인"
 */
import { readFileSync } from "fs";
import { runPlanner } from "./agents/planner.js";
import { runGenerator } from "./agents/generator.js";
import { runEvaluator } from "./agents/evaluator.js";
import { negotiateContract } from "./contracts/template.js";
import { allCriteriaPassed } from "./criteria/index.js";
import { saveReport } from "./utils/report.js";
import type {
  RunReport,
  SprintReport,
  IterationReport,
  CriteriaScores,
} from "./utils/report.js";

// ── 설정 ──────────────────────────────────────────────
const MAX_ITERATIONS = 3; // Sprint 당 최대 Generator↔Evaluator 반복
const DEV_SERVER_URL = "http://localhost:3000";

// ── 메인 ──────────────────────────────────────────────
async function main() {
  const userPrompt = process.argv[2];
  if (!userPrompt) {
    console.error("Usage: pnpm harness \"<프롬프트>\"");
    console.error('Example: pnpm harness "쿠폰 페이지를 모던하게 리디자인"');
    process.exit(1);
  }

  const startedAt = new Date().toISOString();
  let totalCostUsd = 0;

  console.log("╔══════════════════════════════════════════╗");
  console.log("║   3-Agent Harness — CoolStay Web        ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\nPrompt: "${userPrompt}"\n`);

  // ── Phase 1: Planner ────────────────────────────────
  console.log("▸ [1/3] Planner — 스펙 확장 중...");
  const planResult = await runPlanner(userPrompt);
  totalCostUsd += planResult.costUsd;

  console.log(`  ✓ 스펙 생성: ${planResult.specFile}`);
  console.log(`  ✓ 스프린트: ${planResult.sprints.join(", ")}`);
  console.log(
    `  ✓ 비용: $${planResult.costUsd.toFixed(2)} / ${(planResult.durationMs / 1000).toFixed(0)}s\n`,
  );

  // 스펙 읽기
  let spec: string;
  try {
    spec = readFileSync(planResult.specFile, "utf-8");
  } catch {
    console.error(`  ✗ 스펙 파일을 읽을 수 없음: ${planResult.specFile}`);
    process.exit(1);
  }

  // ── Phase 2: Sprint Loop ────────────────────────────
  const sprintReports: SprintReport[] = [];

  for (let i = 0; i < planResult.sprints.length; i++) {
    const sprintName = planResult.sprints[i]!;
    console.log(
      `▸ [2/3] Sprint ${i + 1}/${planResult.sprints.length}: ${sprintName}`,
    );

    // ── Contract 협상 ──
    console.log("  ├─ Contract 협상...");
    const contract = await negotiateContract({
      sprintName,
      sprintGoal: sprintName,
      spec,
    });
    console.log(
      `  ├─ Contract 합의: ${contract.completionCriteria.length}개 기준, ${contract.testScenarios.length}개 테스트`,
    );

    // ── Generator ↔ Evaluator 루프 ──
    const iterations: IterationReport[] = [];
    let lastHandoff = "";
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
      console.log(`  ├─ Round ${round}/${MAX_ITERATIONS}`);

      // Generator
      console.log("  │  ├─ Generator 구현 중...");
      const genResult = await runGenerator({
        contract: contract.rawMarkdown,
        spec,
        previousFeedback: round > 1 ? lastFeedback : undefined,
        iterationRound: round > 1 ? round : undefined,
      });
      totalCostUsd += genResult.costUsd;
      lastHandoff = genResult.handoff;
      console.log(
        `  │  ├─ 구현 완료 ($${genResult.costUsd.toFixed(2)} / ${(genResult.durationMs / 1000).toFixed(0)}s)`,
      );

      // Evaluator
      console.log("  │  ├─ Evaluator 평가 중...");
      const evalResult = await runEvaluator({
        contract: contract.rawMarkdown,
        handoff: lastHandoff,
        targetUrl: DEV_SERVER_URL,
        iterationRound: round,
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
        `  │  ├─ 점수: D=${evalResult.scores.designQuality} O=${evalResult.scores.originality} C=${evalResult.scores.craft} F=${evalResult.scores.functionality} → ${evalResult.scores.weighted.toFixed(1)}`,
      );
      console.log(
        `  │  ├─ 버그: ${evalResult.bugs.length}개`,
      );
      console.log(
        `  │  └─ ${evalResult.passed ? "✓ PASS" : "✗ FAIL — 피드백 전달 후 재시도"}`,
      );

      if (evalResult.passed) {
        sprintPassed = true;
        break;
      }
    }

    sprintReports.push({
      sprintIndex: i,
      contractFile: contract.filePath,
      iterations,
      finalScores,
      passed: sprintPassed,
    });

    console.log(
      `  └─ Sprint ${i + 1} ${sprintPassed ? "✓ PASS" : "✗ FAIL (max iterations reached)"}\n`,
    );
  }

  // ── Phase 3: Report ─────────────────────────────────
  const completedAt = new Date().toISOString();
  const totalDurationMs = Date.now() - new Date(startedAt).getTime();

  const passedCount = sprintReports.filter((s) => s.passed).length;
  let finalVerdict: "pass" | "partial" | "fail";
  if (passedCount === sprintReports.length) finalVerdict = "pass";
  else if (passedCount > 0) finalVerdict = "partial";
  else finalVerdict = "fail";

  const report: RunReport = {
    prompt: userPrompt,
    startedAt,
    completedAt,
    totalDurationMs,
    totalCostUsd,
    sprints: sprintReports,
    finalVerdict,
  };

  const reportPath = saveReport(report);

  console.log("╔══════════════════════════════════════════╗");
  console.log("║              Run Complete                ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(
    `║  Duration: ${(totalDurationMs / 1000 / 60).toFixed(1)} min`.padEnd(43) +
      "║",
  );
  console.log(
    `║  Cost:     $${totalCostUsd.toFixed(2)}`.padEnd(43) + "║",
  );
  console.log(
    `║  Sprints:  ${passedCount}/${sprintReports.length} passed`.padEnd(43) +
      "║",
  );
  console.log(
    `║  Verdict:  ${finalVerdict.toUpperCase()}`.padEnd(43) + "║",
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
