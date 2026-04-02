/**
 * 실행 리포트 생성 유틸
 */
import { writeArtifact, timestamp } from "./file-comm.js";

export type SprintReport = {
  sprintIndex: number;
  contractFile: string;
  iterations: IterationReport[];
  finalScores: CriteriaScores;
  passed: boolean;
};

export type IterationReport = {
  round: number;
  scores: CriteriaScores;
  passed: boolean;
  feedback: string;
  durationMs: number;
  costUsd: number;
};

export type CriteriaScores = {
  designQuality: number;
  originality: number;
  craft: number;
  functionality: number;
  weighted: number;
};

export type RunReport = {
  prompt: string;
  startedAt: string;
  completedAt: string;
  totalDurationMs: number;
  totalCostUsd: number;
  sprints: SprintReport[];
  finalVerdict: "pass" | "partial" | "fail";
};

export function generateReport(report: RunReport): string {
  const lines: string[] = [
    `# Harness Run Report`,
    ``,
    `**Prompt**: ${report.prompt}`,
    `**Started**: ${report.startedAt}`,
    `**Completed**: ${report.completedAt}`,
    `**Duration**: ${(report.totalDurationMs / 1000 / 60).toFixed(1)} min`,
    `**Cost**: $${report.totalCostUsd.toFixed(2)}`,
    `**Verdict**: ${report.finalVerdict.toUpperCase()}`,
    ``,
    `## Sprints`,
    ``,
  ];

  for (const sprint of report.sprints) {
    lines.push(`### Sprint ${sprint.sprintIndex + 1}`);
    lines.push(`- Iterations: ${sprint.iterations.length}`);
    lines.push(`- Passed: ${sprint.passed ? "YES" : "NO"}`);
    lines.push(`- Final Scores:`);
    lines.push(
      `  - Design Quality: ${sprint.finalScores.designQuality}/10`,
    );
    lines.push(`  - Originality: ${sprint.finalScores.originality}/10`);
    lines.push(`  - Craft: ${sprint.finalScores.craft}/10`);
    lines.push(
      `  - Functionality: ${sprint.finalScores.functionality}/10`,
    );
    lines.push(
      `  - **Weighted**: ${sprint.finalScores.weighted.toFixed(1)}/10`,
    );
    lines.push(``);

    for (const iter of sprint.iterations) {
      lines.push(`#### Round ${iter.round}`);
      lines.push(
        `- Scores: D=${iter.scores.designQuality} O=${iter.scores.originality} C=${iter.scores.craft} F=${iter.scores.functionality} → ${iter.scores.weighted.toFixed(1)}`,
      );
      lines.push(`- Passed: ${iter.passed}`);
      lines.push(`- Duration: ${(iter.durationMs / 1000).toFixed(0)}s`);
      lines.push(`- Cost: $${iter.costUsd.toFixed(2)}`);
      if (!iter.passed) {
        lines.push(`- Feedback: ${iter.feedback.slice(0, 200)}...`);
      }
      lines.push(``);
    }
  }

  return lines.join("\n");
}

export function saveReport(report: RunReport): string {
  const content = generateReport(report);
  const filename = `run-${timestamp()}.md`;
  return writeArtifact("evaluations", filename, content);
}
