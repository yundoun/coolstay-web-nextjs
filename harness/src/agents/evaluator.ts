/**
 * Evaluator Agent
 * Playwright MCP로 실제 페이지를 탐색하고 4가지 기준으로 채점
 */
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { buildCriteriaPrompt, computeWeightedScore, allCriteriaPassed } from "../criteria/index.js";
import type { CriteriaScores } from "../utils/report.js";

const PROMPT_PATH = join(import.meta.dirname, "../../prompts/evaluator.md");
const PROJECT_ROOT = join(import.meta.dirname, "../../../");

export type EvaluatorResult = {
  scores: CriteriaScores;
  passed: boolean;
  feedback: string;
  bugs: Array<{ severity: string; description: string; location: string }>;
  contractChecklist: Array<{
    criterion: string;
    passed: boolean;
    evidence: string;
  }>;
  costUsd: number;
  durationMs: number;
};

export async function runEvaluator(params: {
  contract: string;
  handoff: string;
  targetUrl: string;
  iterationRound: number;
  lite?: boolean;
}): Promise<EvaluatorResult> {
  const rawPrompt = readFileSync(PROMPT_PATH, "utf-8");
  const systemPrompt = rawPrompt.replace(
    "{{CRITERIA_PROMPT}}",
    buildCriteriaPrompt(),
  );
  const startTime = Date.now();

  const efficiencyRules = params.lite
    ? `
## 효율 규칙 (Lite 모드 — 필수)
- navigate는 최대 1회. 같은 URL을 반복 방문하지 마라
- screenshot 1장으로 다수 기준을 한꺼번에 판정하라
- resize(모바일 검증)는 생략하라
- 클릭 테스트는 핵심 1~2개만 수행하라
- 목표: 전체 평가를 10턴 이내로 완료하라
`
    : `
## 효율 규칙 (필수)
- navigate는 페이지당 최대 1회. 같은 URL을 반복 방문하지 마라
- screenshot 촬영 후 육안으로 다수 기준을 한꺼번에 판정하라
- resize(모바일 검증)는 Contract에 반응형 기준이 있을 때만 1회 수행
- 목표: 전체 평가를 20턴 이내로 완료하라
`;

  const prompt = `
# 평가 지시 (Round ${params.iterationRound})

## Sprint Contract (완료 기준)
${params.contract}

## Generator 핸드오프 (구현 결과)
${params.handoff}

## 평가 대상 URL
${params.targetUrl}
${efficiencyRules}
## 수행할 작업

1. 위 URL로 Playwright를 사용해 접근하라
2. 전체 페이지 스크린샷을 찍어라
3. 스크린샷을 보고 Contract 기준을 한꺼번에 판정하라
4. 필요시에만 클릭/resize 추가 검증하라 (최소한으로)
5. 4가지 채점 기준으로 점수를 매겨라

반드시 아래 JSON 형식으로만 최종 응답하라 (마크다운 코드블록 없이 순수 JSON):

{
  "scores": {
    "designQuality": <1-10>,
    "originality": <1-10>,
    "craft": <1-10>,
    "functionality": <1-10>
  },
  "contractChecklist": [
    { "criterion": "기준 설명", "passed": true, "evidence": "근거" }
  ],
  "bugs": [
    { "severity": "critical", "description": "설명", "location": "파일:라인" }
  ],
  "feedback": "Generator에게 전달할 구체적 개선 지침. 어떤 파일의 어떤 부분을 어떻게 수정해야 하는지 구체적으로.",
  "overallPassed": false
}
`;

  let result = "";
  let costUsd = 0;

  const q = query({
    prompt,
    options: {
      cwd: PROJECT_ROOT,
      model: "claude-sonnet-4-6",
      systemPrompt,
      tools: { type: "preset", preset: "claude_code" },
      allowedTools: params.lite
        ? [
            "Read",
            "Grep",
            "mcp__plugin_playwright_playwright__browser_navigate",
            "mcp__plugin_playwright_playwright__browser_take_screenshot",
            "mcp__plugin_playwright_playwright__browser_click",
          ]
        : [
            "Read",
            "Glob",
            "Grep",
            "mcp__plugin_playwright_playwright__browser_navigate",
            "mcp__plugin_playwright_playwright__browser_take_screenshot",
            "mcp__plugin_playwright_playwright__browser_click",
            "mcp__plugin_playwright_playwright__browser_resize",
            "mcp__plugin_playwright_playwright__browser_evaluate",
          ],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: params.lite ? 20 : 60,
      maxBudgetUsd: params.lite ? 3 : 10,
    },
  });

  try {
    for await (const message of q) {
      if (message.type === "result") {
        costUsd = message.total_cost_usd;
        if (message.subtype === "success") {
          result = message.result;
        } else {
          result = `[Evaluator stopped: ${message.subtype}]`;
          console.warn(`  │  ⚠ Evaluator stopped: ${message.subtype}`);
        }
      }
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`  │  ⚠ Evaluator error: ${errMsg}`);
    result = result || `[Evaluator error] ${errMsg}`;
  }

  // JSON 파싱
  const parsed = parseEvaluatorOutput(result);

  const scores: CriteriaScores = {
    ...parsed.scores,
    weighted: computeWeightedScore(parsed.scores),
  };

  return {
    scores,
    passed: allCriteriaPassed(scores) && parsed.overallPassed,
    feedback: parsed.feedback,
    bugs: parsed.bugs,
    contractChecklist: parsed.contractChecklist,
    costUsd,
    durationMs: Date.now() - startTime,
  };
}

function parseEvaluatorOutput(raw: string): {
  scores: { designQuality: number; originality: number; craft: number; functionality: number };
  contractChecklist: Array<{ criterion: string; passed: boolean; evidence: string }>;
  bugs: Array<{ severity: string; description: string; location: string }>;
  feedback: string;
  overallPassed: boolean;
} {
  try {
    // JSON이 마크다운 코드블록에 감싸져 있을 수 있음
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // 파싱 실패 시 기본값
  }

  return {
    scores: { designQuality: 5, originality: 5, craft: 5, functionality: 5 },
    contractChecklist: [],
    bugs: [],
    feedback: `Evaluator 출력 파싱 실패. 원본:\n${raw.slice(0, 500)}`,
    overallPassed: false,
  };
}

// 직접 실행 시 (기존 페이지 캘리브레이션)
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] ?? "http://localhost:3000";
  console.log(`Evaluating ${url}...`);
  const result = await runEvaluator({
    contract: "기존 페이지 전반 평가 (캘리브레이션 목적)",
    handoff: "기존 구현 상태 그대로",
    targetUrl: url,
    iterationRound: 0,
  });
  console.log("\n=== Evaluation Result ===");
  console.log(`Scores: D=${result.scores.designQuality} O=${result.scores.originality} C=${result.scores.craft} F=${result.scores.functionality}`);
  console.log(`Weighted: ${result.scores.weighted.toFixed(1)}/10`);
  console.log(`Passed: ${result.passed}`);
  console.log(`Bugs: ${result.bugs.length}`);
  console.log(`Cost: $${result.costUsd.toFixed(2)}`);
}
