import { describe, it, expect, expectTypeOf } from "vitest"
import type { StoragePort } from "../Storage"

describe("StoragePort 포트", () => {
  describe("인터페이스 계약", () => {
    it("get은 key를 받아 T | null을 반환한다", () => {
      expectTypeOf<StoragePort["get"]>().parameter(0).toBeString()
    })

    it("set은 key와 value를 받아 void를 반환한다", () => {
      expectTypeOf<StoragePort["set"]>().parameter(0).toBeString()
      expectTypeOf<StoragePort["set"]>().returns.toBeVoid()
    })

    it("remove는 key를 받아 void를 반환한다", () => {
      expectTypeOf<StoragePort["remove"]>().parameter(0).toBeString()
      expectTypeOf<StoragePort["remove"]>().returns.toBeVoid()
    })

    it("keys는 string[]을 반환한다", () => {
      expectTypeOf<StoragePort["keys"]>().returns.toEqualTypeOf<string[]>()
    })
  })

  describe("구현 호환성", () => {
    it("mock 구현체가 인터페이스를 만족한다", () => {
      const store = new Map<string, unknown>()
      const mockStorage: StoragePort = {
        get: <T>(key: string): T | null => (store.get(key) as T) ?? null,
        set: <T>(key: string, value: T): void => { store.set(key, value) },
        remove: (key: string): void => { store.delete(key) },
        keys: (): string[] => [...store.keys()],
      }

      mockStorage.set("test", { value: 42 })
      expect(mockStorage.get<{ value: number }>("test")).toEqual({ value: 42 })
      expect(mockStorage.keys()).toEqual(["test"])

      mockStorage.remove("test")
      expect(mockStorage.get("test")).toBeNull()
      expect(mockStorage.keys()).toEqual([])
    })
  })
})
