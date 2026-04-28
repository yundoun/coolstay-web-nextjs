import { describe, it, expectTypeOf } from "vitest"
import type { TokenManager } from "../TokenManager"
import type { TokenPair } from "@/lib/api/client"

describe("TokenManager 포트", () => {
  describe("인터페이스 계약", () => {
    it("getToken은 Promise<TokenPair>을 반환한다", () => {
      expectTypeOf<TokenManager["getToken"]>().returns.resolves.toEqualTypeOf<TokenPair>()
    })

    it("setToken은 TokenPair을 받아 void를 반환한다", () => {
      expectTypeOf<TokenManager["setToken"]>().parameter(0).toEqualTypeOf<TokenPair>()
      expectTypeOf<TokenManager["setToken"]>().returns.toBeVoid()
    })

    it("clearToken은 void를 반환한다", () => {
      expectTypeOf<TokenManager["clearToken"]>().returns.toBeVoid()
    })

    it("isAuthenticated는 boolean을 반환한다", () => {
      expectTypeOf<TokenManager["isAuthenticated"]>().returns.toBeBoolean()
    })

    it("onAuthError는 선택적 콜백 설정 메서드이다", () => {
      expectTypeOf<TokenManager["onAuthError"]>().parameter(0).toEqualTypeOf<(() => void) | null>()
    })
  })
})
