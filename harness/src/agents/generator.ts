/**
 * Generator Agent
 * Sprint Contract를 받아 코드를 구현하고 핸드오프를 반환
 */
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";
import { join } from "path";

const PROMPT_PATH = join(import.meta.dirname, "../../prompts/generator.md");
const PROJECT_ROOT = join(import.meta.dirname, "../../../");

export type GeneratorResult = {
  handoff: string;
  costUsd: number;
  durationMs: number;
};

/**
 * Generator 실행 — 구현 또는 피드백 기반 재작업
 */
export async function runGenerator(params: {
  contract: string;
  spec: string;
  previousFeedback?: string;
  iterationRound?: number;
  lite?: boolean;
}): Promise<GeneratorResult> {
  const systemPrompt = readFileSync(PROMPT_PATH, "utf-8");
  const startTime = Date.now();

  let prompt: string;

  if (params.previousFeedback && params.iterationRound) {
    prompt = `
# 재작업 지시 (Round ${params.iterationRound})

## Evaluator 피드백
${params.previousFeedback}

## 원래 Sprint Contract
${params.contract}

## 제품 스펙 (참고)
${params.spec}

위 피드백에서 지적된 문제들을 수정하라.
수정 완료 후 핸드오프를 작성하라.

핸드오프 형식:
---HANDOFF---
변경 파일:
- <파일 경로>: <변경 요약>

자체 체크리스트:
- [x/] <Contract 기준>: <상태>

남은 이슈:
- <있으면 기술>
---END---
`;
  } else {
    prompt = `
# 구현 지시

## Sprint Contract
${params.contract}

## 제품 스펙
${params.spec}

Sprint Contract에 정의된 범위를 구현하라.
프로젝트 루트: ${PROJECT_ROOT}

구현 완료 후 핸드오프를 작성하라.

핸드오프 형식:
---HANDOFF---
변경 파일:
- <파일 경로>: <변경 요약>

자체 체크리스트:
- [x/] <Contract 기준>: <상태>

남은 이슈:
- <있으면 기술>
---END---
`;
  }

  let result = "";
  let costUsd = 0;

  const q = query({
    prompt,
    options: {
      cwd: PROJECT_ROOT,
      model: "claude-sonnet-4-6",
      systemPrompt,
      tools: { type: "preset", preset: "claude_code" },
      allowedTools: [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash(npm:*)",
        "Bash(pnpm:*)",
        "Bash(npx:*)",
      ],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: params.lite ? 50 : 100,
      maxBudgetUsd: params.lite ? 5 : 30,
    },
  });

  try {
    for await (const message of q) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          result = message.result;
          costUsd = message.total_cost_usd;
        } else {
          // error_max_turns, error_max_budget_usd 등
          costUsd = message.total_cost_usd;
          result = `[Generator stopped: ${message.subtype}] 구현이 턴/예산 한도에 도달했습니다. 지금까지의 작업은 파일시스템에 저장되어 있습니다.`;
          console.warn(`  │  ⚠ Generator stopped: ${message.subtype} (${message.num_turns} turns, $${costUsd.toFixed(2)})`);
        }
      }
    }
  } catch (err) {
    // SDK가 에러를 throw하는 경우 graceful 처리
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`  │  ⚠ Generator error: ${errMsg}`);
    result = result || `[Generator error] ${errMsg}`;
  }

  return {
    handoff: result,
    costUsd,
    durationMs: Date.now() - startTime,
  };
}

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Generator requires contract + spec input. Use orchestrator.");
}
