import { describe, it, expect, beforeEach } from "vitest"
import { LocalStorageAdapter } from "../LocalStorageAdapter"
import type { StoragePort } from "@/lib/ports/Storage"

describe("LocalStorageAdapter", () => {
  let adapter: StoragePort
  let mockStorage: Record<string, string>

  let mockLocalStorage: Storage

  beforeEach(() => {
    mockStorage = {}
    mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => { mockStorage[key] = value },
      removeItem: (key: string) => { delete mockStorage[key] },
      get length() { return Object.keys(mockStorage).length },
      key: (index: number) => Object.keys(mockStorage)[index] ?? null,
      clear: () => { mockStorage = {} },
    }
    adapter = new LocalStorageAdapter(mockLocalStorage)
  })

  describe("get", () => {
    it("저장된 값을 JSON 파싱하여 반환한다", () => {
      mockStorage["test-key"] = JSON.stringify({ name: "hello", count: 3 })
      const result = adapter.get<{ name: string; count: number }>("test-key")
      expect(result).toEqual({ name: "hello", count: 3 })
    })

    it("존재하지 않는 키는 null을 반환한다", () => {
      expect(adapter.get("nonexistent")).toBeNull()
    })

    it("잘못된 JSON은 null을 반환한다", () => {
      mockStorage["bad-json"] = "not-valid-json{"
      expect(adapter.get("bad-json")).toBeNull()
    })
  })

  describe("set", () => {
    it("값을 JSON 직렬화하여 저장한다", () => {
      adapter.set("key", { items: [1, 2, 3] })
      expect(mockStorage["key"]).toBe(JSON.stringify({ items: [1, 2, 3] }))
    })

    it("문자열 값도 저장할 수 있다", () => {
      adapter.set("str", "hello")
      expect(JSON.parse(mockStorage["str"])).toBe("hello")
    })

    it("숫자 값도 저장할 수 있다", () => {
      adapter.set("num", 42)
      expect(JSON.parse(mockStorage["num"])).toBe(42)
    })
  })

  describe("remove", () => {
    it("키를 삭제한다", () => {
      mockStorage["to-remove"] = JSON.stringify("value")
      adapter.remove("to-remove")
      expect(adapter.get("to-remove")).toBeNull()
    })
  })

  describe("keys", () => {
    it("저장된 모든 키를 반환한다", () => {
      mockStorage["a"] = "1"
      mockStorage["b"] = "2"
      mockStorage["c"] = "3"
      expect(adapter.keys()).toEqual(["a", "b", "c"])
    })

    it("빈 저장소는 빈 배열을 반환한다", () => {
      expect(adapter.keys()).toEqual([])
    })
  })

  describe("SSR 안전", () => {
    it("window가 없는 환경에서 get은 null을 반환한다", () => {
      const ssrAdapter = new LocalStorageAdapter(undefined)
      expect(ssrAdapter.get("any")).toBeNull()
    })

    it("window가 없는 환경에서 set은 에러 없이 동작한다", () => {
      const ssrAdapter = new LocalStorageAdapter(undefined)
      expect(() => ssrAdapter.set("key", "value")).not.toThrow()
    })

    it("window가 없는 환경에서 keys는 빈 배열을 반환한다", () => {
      const ssrAdapter = new LocalStorageAdapter(undefined)
      expect(ssrAdapter.keys()).toEqual([])
    })
  })
})
