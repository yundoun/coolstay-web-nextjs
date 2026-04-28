/** API 성공 응답 코드 */
export const SUCCESS_CODE = "20000000"

/** 토큰 에러 코드 — 토큰 재발급 후 재시도 대상 */
export const TOKEN_ERROR_CODES = new Set([
  "40000001", // 잘못된 서버 타입
  "40000003", // 잘못된 토큰 (필드 부족/잘못된 인증 타입)
  "40000004", // 만료된 토큰
])
