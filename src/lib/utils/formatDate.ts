/**
 * API 타임스탬프를 YYYY-MM-DD 형식으로 변환
 * @param value - 초 단위 timestamp(number), ISO 문자열, 또는 undefined
 *
 * CoolStay API는 타임스탬프를 초 단위로 반환합니다.
 * 10자리 숫자(< 10000000000)는 초 단위로 판단하여 * 1000 변환합니다.
 */
export function formatTimestamp(value?: string | number | null): string {
  if (!value) return ""
  let date: Date
  if (typeof value === "number") {
    // 초 단위(10자리) → 밀리초 변환
    date = new Date(value < 10_000_000_000 ? value * 1000 : value)
  } else {
    date = new Date(value)
  }
  if (isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * API 타임스탬프를 YYYY.MM.DD 형식으로 변환 (UI 표시용)
 */
export function formatTimestampDot(value?: string | number | null): string {
  const iso = formatTimestamp(value)
  return iso ? iso.replace(/-/g, ".") : ""
}

/**
 * 초 단위 타임스탬프를 밀리초 Date로 변환
 */
export function toMillis(seconds?: number): number {
  if (!seconds) return 0
  return seconds < 10_000_000_000 ? seconds * 1000 : seconds
}
