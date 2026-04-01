/**
 * API 타임스탬프를 YYYY-MM-DD 형식으로 변환
 * @param value - ISO 문자열, 밀리초 타임스탬프(number), 또는 undefined
 */
export function formatTimestamp(value?: string | number | null): string {
  if (!value) return ""
  const date = typeof value === "number" ? new Date(value) : new Date(value)
  if (isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
