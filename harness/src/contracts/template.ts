/**
 * Sprint Contract 생성 및 협상
 *
 * Generator가 초안을 작성하고 Evaluator가 검토·수정하여 합의한다.
 * 최대 2라운드로 제한.
 */
import { query } from "@anthropic-ai/claude-agent-sdk";
import { writeArtifact, timestamp } from "../utils/file-comm.js";

const PROJECT_ROOT = new URL("../../../", import.meta.url).pathname;

export type SprintContract = {
  sprintName: string;
  scope: string;
  completionCriteria: string[];
  testScenarios: string[];
  rawMarkdown: string;
  filePath: string;
};

/**
 * Generator가 Contract 초안 작성 → Evaluator 검토 → 합의
 */
export async function negotiateContract(params: {
  sprintName: string;
  sprintGoal: string;
  spec: string;
}): Promise<SprintContract> {
  // Step 1: Generator가 초안 작성
  const draftPrompt = `
# Sprint Contract 초안 작성

## Sprint: ${params.sprintName}
## 목표: ${params.sprintGoal}

## 제품 스펙 (참고)
${params.spec}

다음 구조로 Sprint Contract 초안을 작성하라:

---CONTRACT---
# Sprint: ${params.sprintName}

## 구현 범위
- (이 스프린트에서 구현할 구체적 항목들)

## 완료 기준
1. (구체적이고 테스트 가능한 기준)
2. ...

## 테스트 시나리오
1. (Evaluator가 Playwright로 검증할 시나리오)
2. ...

## 제외 범위
- (이 스프린트에서 명시적으로 하지 않을 것)
---END---
`;

  let draft = "";
  const q1 = query({
    prompt: draftPrompt,
    options: {
      cwd: PROJECT_ROOT,
      model: "claude-sonnet-4-6",
      tools: { type: "preset", preset: "claude_code" },
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: 10,
      maxBudgetUsd: 3,
    },
  });

  try {
    for await (const message of q1) {
      if (message.type === "result") {
        if (message.subtype === "success") draft = message.result;
      }
    }
  } catch (err) {
    console.warn(`  ⚠ Contract draft error: ${err instanceof Error ? err.message : err}`);
  }

  // Step 2: Evaluator가 검토·수정
  const reviewPrompt = `
# Sprint Contract 검토

Generator가 작성한 Contract 초안을 검토하라.

## 초안
${draft}

검토 기준:
1. 완료 기준이 구체적이고 테스트 가능한가?
2. 테스트 시나리오가 Playwright로 검증 가능한가?
3. 범위가 너무 넓거나 좁지 않은가?
4. 누락된 중요 기준이 있는가?

수정이 필요하면 수정된 전체 Contract를 출력하라.
수정이 불필요하면 "APPROVED" 라고만 출력하라.

출력 형식:
---CONTRACT---
(수정된 전체 Contract 또는 원본 그대로)
---END---
`;

  let reviewed = "";
  const q2 = query({
    prompt: reviewPrompt,
    options: {
      cwd: PROJECT_ROOT,
      model: "claude-sonnet-4-6",
      tools: { type: "preset", preset: "claude_code" },
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: 10,
      maxBudgetUsd: 3,
    },
  });

  try {
    for await (const message of q2) {
      if (message.type === "result") {
        if (message.subtype === "success") reviewed = message.result;
      }
    }
  } catch (err) {
    console.warn(`  ⚠ Contract review error: ${err instanceof Error ? err.message : err}`);
  }

  // 최종 Contract 결정
  const finalContract = reviewed.includes("APPROVED") ? draft : reviewed;

  // Contract 파싱
  const contractMatch = finalContract.match(
    /---CONTRACT---([\s\S]*?)---END---/,
  );
  const rawMarkdown = contractMatch?.[1]?.trim() ?? finalContract;

  // 완료 기준 추출
  const criteriaSection = rawMarkdown.match(
    /## 완료 기준\n([\s\S]*?)(?=\n## |$)/,
  );
  const completionCriteria =
    criteriaSection?.[1]
      ?.split("\n")
      .filter((l) => l.match(/^\d+\./))
      .map((l) => l.replace(/^\d+\.\s*/, "").trim()) ?? [];

  // 테스트 시나리오 추출
  const testSection = rawMarkdown.match(
    /## 테스트 시나리오\n([\s\S]*?)(?=\n## |$)/,
  );
  const testScenarios =
    testSection?.[1]
      ?.split("\n")
      .filter((l) => l.match(/^\d+\./))
      .map((l) => l.replace(/^\d+\.\s*/, "").trim()) ?? [];

  // 파일로 저장
  const filename = `contract-${params.sprintName.toLowerCase().replace(/\s+/g, "-")}-${timestamp()}.md`;
  const filePath = writeArtifact("contracts", filename, rawMarkdown);

  return {
    sprintName: params.sprintName,
    scope: rawMarkdown,
    completionCriteria,
    testScenarios,
    rawMarkdown,
    filePath,
  };
}
