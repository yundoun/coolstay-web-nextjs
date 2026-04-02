/**
 * 통합 채점 기준 + 가중치 계산
 *
 * 가중치 배분 (블로그 기준):
 * - Design Quality: 30% — 시각적 일관성·무드 (기본값이 약해서 강조)
 * - Originality:    30% — AI 슬럽 탈피 (기본값이 약해서 강조)
 * - Craft:          20% — 기술적 완성도 (기본 역량, 대체로 양호)
 * - Functionality:  20% — 사용성 (기본 역량, 대체로 양호)
 */
import { designQualityCriteria } from "./design.js";
import { originalityCriteria } from "./originality.js";
import { craftCriteria } from "./craft.js";
import { functionalityCriteria } from "./functionality.js";
import type { CriteriaScores } from "../utils/report.js";

export const ALL_CRITERIA = [
  designQualityCriteria,
  originalityCriteria,
  craftCriteria,
  functionalityCriteria,
] as const;

export type CriterionName =
  | "Design Quality"
  | "Originality"
  | "Craft"
  | "Functionality";

/**
 * 가중 평균 점수 계산
 */
export function computeWeightedScore(scores: {
  designQuality: number;
  originality: number;
  craft: number;
  functionality: number;
}): number {
  return (
    scores.designQuality * designQualityCriteria.weight +
    scores.originality * originalityCriteria.weight +
    scores.craft * craftCriteria.weight +
    scores.functionality * functionalityCriteria.weight
  );
}

/**
 * 모든 기준이 통과선을 넘었는지 판별
 */
export function allCriteriaPassed(scores: CriteriaScores): boolean {
  return (
    scores.designQuality >= designQualityCriteria.passThreshold &&
    scores.originality >= originalityCriteria.passThreshold &&
    scores.craft >= craftCriteria.passThreshold &&
    scores.functionality >= functionalityCriteria.passThreshold
  );
}

/**
 * Evaluator 프롬프트에 삽입할 채점 기준 텍스트 생성
 */
export function buildCriteriaPrompt(): string {
  return ALL_CRITERIA.map(
    (c) => `
## ${c.name} (가중치: ${(c.weight * 100).toFixed(0)}%, 통과선: ${c.passThreshold}/10)

${c.description}

### 채점 가이드
${c.scoringGuide}
`,
  ).join("\n---\n");
}

export {
  designQualityCriteria,
  originalityCriteria,
  craftCriteria,
  functionalityCriteria,
};
