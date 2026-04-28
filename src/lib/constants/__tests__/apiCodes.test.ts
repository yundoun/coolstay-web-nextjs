import { describe, it, expect } from "vitest"
import { SUCCESS_CODE, TOKEN_ERROR_CODES } from "../apiCodes"

describe("API 응답 코드 상수", () => {
  it("SUCCESS_CODE는 '20000000'이다", () => {
    expect(SUCCESS_CODE).toBe("20000000")
  })

  it("TOKEN_ERROR_CODES에 잘못된 서버 타입 코드가 포함된다", () => {
    expect(TOKEN_ERROR_CODES.has("40000001")).toBe(true)
  })

  it("TOKEN_ERROR_CODES에 잘못된 토큰 코드가 포함된다", () => {
    expect(TOKEN_ERROR_CODES.has("40000003")).toBe(true)
  })

  it("TOKEN_ERROR_CODES에 만료된 토큰 코드가 포함된다", () => {
    expect(TOKEN_ERROR_CODES.has("40000004")).toBe(true)
  })

  it("TOKEN_ERROR_CODES에 성공 코드는 포함되지 않는다", () => {
    expect(TOKEN_ERROR_CODES.has("20000000")).toBe(false)
  })

  it("TOKEN_ERROR_CODES는 정확히 3개의 코드를 포함한다", () => {
    expect(TOKEN_ERROR_CODES.size).toBe(3)
  })
})
