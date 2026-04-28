import { describe, it, expect, vi } from "vitest"
import { ApiHomeRepository } from "../ApiHomeRepository"
import type { HttpClient } from "@/lib/ports/HttpClient"
import type { HomeRepository } from "../../ports/HomeRepository"

describe("ApiHomeRepository", () => {
  function createMockHttp(): HttpClient {
    return { get: vi.fn(async () => ({})), post: vi.fn(async () => ({})) }
  }

  it("HomeRepository 인터페이스를 구현한다", () => {
    const repo: HomeRepository = new ApiHomeRepository(createMockHttp())
    expect(typeof repo.getMain).toBe("function")
    expect(typeof repo.getRegionStores).toBe("function")
  })

  it("getMain이 기본 지역코드로 POST한다", async () => {
    const http = createMockHttp()
    const repo = new ApiHomeRepository(http)
    await repo.getMain()

    expect(http.post).toHaveBeenCalledWith("/home/main", expect.objectContaining({
      region_code: "ALL_0100000",
    }))
  })

  it("getMain이 recentStoreKeys를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiHomeRepository(http)
    await repo.getMain("AREA_001", "key1,key2")

    expect(http.post).toHaveBeenCalledWith("/home/main", expect.objectContaining({
      region_code: "AREA_001",
      recent_store_keys: "key1,key2",
    }))
  })

  it("getRegionStores가 올바른 엔드포인트를 호출한다", async () => {
    const http = createMockHttp()
    const repo = new ApiHomeRepository(http)
    await repo.getRegionStores("AREA_002")

    expect(http.post).toHaveBeenCalledWith("/home/regionStores", {
      region_code: "AREA_002",
    })
  })
})
