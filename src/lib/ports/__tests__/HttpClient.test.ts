import { describe, it, expect, expectTypeOf } from "vitest"
import type { HttpClient, HttpParams } from "../HttpClient"

describe("HttpClient 포트", () => {
  describe("인터페이스 계약", () => {
    it("get 메서드 시그니처가 정의되어 있다", () => {
      expectTypeOf<HttpClient["get"]>().toBeFunction()
      // get<T>(path: string, params?: HttpParams): Promise<T>
      expectTypeOf<HttpClient["get"]>().parameter(0).toBeString()
    })

    it("post 메서드 시그니처가 정의되어 있다", () => {
      expectTypeOf<HttpClient["post"]>().toBeFunction()
      // post<T>(path: string, body?: unknown, params?: HttpParams): Promise<T>
      expectTypeOf<HttpClient["post"]>().parameter(0).toBeString()
    })

    it("HttpParams 타입은 Record<string, string | number | boolean | undefined>이다", () => {
      expectTypeOf<HttpParams>().toMatchTypeOf<Record<string, string | number | boolean | undefined>>()
    })
  })

  describe("구현 호환성", () => {
    it("현재 api 객체의 시그니처와 호환된다", async () => {
      // 현재 api 객체: { get<T>(path, params?), post<T>(path, body?, params?) }
      // HttpClient 인터페이스로 할당 가능해야 함
      const mockClient: HttpClient = {
        get: async <T>(_path: string, _params?: HttpParams): Promise<T> => {
          return {} as T
        },
        post: async <T>(_path: string, _body?: unknown, _params?: HttpParams): Promise<T> => {
          return {} as T
        },
      }

      const result = await mockClient.get<{ data: string }>("/test")
      expect(result).toBeDefined()
    })

    it("제네릭 타입 파라미터가 반환 타입에 반영된다", async () => {
      const mockClient: HttpClient = {
        get: async <T>(): Promise<T> => ({ items: [1, 2, 3] }) as T,
        post: async <T>(): Promise<T> => ({ id: 1 }) as T,
      }

      const getResult = await mockClient.get<{ items: number[] }>("/list")
      expect(getResult.items).toEqual([1, 2, 3])

      const postResult = await mockClient.post<{ id: number }>("/create", { name: "test" })
      expect(postResult.id).toBe(1)
    })
  })
})
