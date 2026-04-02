/**
 * Planner Agent
 * 1줄 프롬프트 → 전체 제품 스펙 + 스프린트 분해
 */
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { writeArtifact, timestamp } from "../utils/file-comm.js";

const PROMPT_PATH = join(import.meta.dirname, "../../prompts/planner.md");
const PROJECT_ROOT = join(import.meta.dirname, "../../../");

export type PlannerResult = {
  specFile: string;
  sprints: string[];
  costUsd: number;
  durationMs: number;
};

export async function runPlanner(userPrompt: string): Promise<PlannerResult> {
  const systemPrompt = readFileSync(PROMPT_PATH, "utf-8");
  const startTime = Date.now();

  const fullPrompt = `
사용자 요청: "${userPrompt}"

프로젝트 루트: ${PROJECT_ROOT}

다음을 수행하라:
1. 프로젝트의 기존 코드베이스를 분석하라 (src/domains/, src/components/, src/app/ 구조 확인)
2. 사용자 요청을 상세한 제품 스펙으로 확장하라
3. 스펙을 스프린트로 분해하라
4. 최종 스펙을 ${join(PROJECT_ROOT, "harness/artifacts/specs/")} 디렉토리에 spec-${timestamp()}.md 파일로 저장하라
5. 저장한 파일 경로와 스프린트 목록을 최종 응답으로 출력하라

최종 응답 형식 (반드시 이 형식으로):
---RESULT---
SPEC_FILE: <저장한 파일 절대 경로>
SPRINTS: <Sprint 1 이름> | <Sprint 2 이름> | ...
---END---
`;

  let result = "";
  let costUsd = 0;

  const q = query({
    prompt: fullPrompt,
    options: {
      cwd: PROJECT_ROOT,
      model: "claude-sonnet-4-6",
      systemPrompt,
      tools: { type: "preset", preset: "claude_code" },
      allowedTools: ["Read", "Glob", "Grep", "Write"],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: 20,
      maxBudgetUsd: 5,
    },
  });

  try {
    for await (const message of q) {
      if (message.type === "result") {
        costUsd = message.total_cost_usd;
        if (message.subtype === "success") {
          result = message.result;
        } else {
          console.warn(`  ⚠ Planner stopped: ${message.subtype}`);
        }
      }
    }
  } catch (err) {
    console.warn(`  ⚠ Planner error: ${err instanceof Error ? err.message : err}`);
  }

  // 결과 파싱
  const specMatch = result.match(/SPEC_FILE:\s*(.+)/);
  const sprintsMatch = result.match(/SPRINTS:\s*(.+)/);

  const specFile = specMatch?.[1]?.trim() ?? "";
  const sprints = sprintsMatch?.[1]?.split("|").map((s) => s.trim()) ?? [];

  return {
    specFile,
    sprints,
    costUsd,
    durationMs: Date.now() - startTime,
  };
}

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  const prompt = process.argv[2];
  if (!prompt) {
    console.error("Usage: tsx src/agents/planner.ts <prompt>");
    process.exit(1);
  }
  const result = await runPlanner(prompt);
  console.log("\n=== Planner Result ===");
  console.log(`Spec: ${result.specFile}`);
  console.log(`Sprints: ${result.sprints.join(", ")}`);
  console.log(`Cost: $${result.costUsd.toFixed(2)}`);
  console.log(`Duration: ${(result.durationMs / 1000).toFixed(0)}s`);
}
