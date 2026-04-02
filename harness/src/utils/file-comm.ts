/**
 * 에이전트 간 파일 기반 통신 유틸리티
 * 각 에이전트는 artifacts/ 디렉토리를 통해 산출물을 교환한다.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";

const ARTIFACTS_DIR = join(import.meta.dirname, "../../artifacts");

export function artifactPath(
  category: "specs" | "contracts" | "evaluations",
  filename: string,
): string {
  return join(ARTIFACTS_DIR, category, filename);
}

export function writeArtifact(
  category: "specs" | "contracts" | "evaluations",
  filename: string,
  content: string,
): string {
  const path = artifactPath(category, filename);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf-8");
  return path;
}

export function readArtifact(
  category: "specs" | "contracts" | "evaluations",
  filename: string,
): string | null {
  const path = artifactPath(category, filename);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf-8");
}

export function timestamp(): string {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, "-").slice(0, 19);
}
