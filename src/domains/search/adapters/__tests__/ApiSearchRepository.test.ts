import { describe, it, expect, vi } from "vitest"
import { ApiSearchRepository } from "../ApiSearchRepository"
import type { HttpClient } from "@/lib/ports/HttpClient"
import type { SearchRepository } from "../../ports/SearchRepository"

describe("ApiSearchRepository", () => {
  function createMockHttp(): HttpClient {
    return { get: vi.fn(async () => ({})), post: vi.fn(async () => ({})) }
  }

  it("SearchRepository 인터페이스를 구현한다", () => {
    const repo: SearchRepository = new ApiSearchRepository(createMockHttp())
    expect(typeof repo.getRegions).toBe("function")
    expect(typeof repo.getContentsList).toBe("function")
    expect(typeof repo.getTotalList).toBe("function")
    expect(typeof repo.getFilterKeys).toBe("function")
    expect(typeof repo.getFilterList).toBe("function")
    expect(typeof repo.getMyAreaList).toBe("function")
    expect(typeof repo.getKeywordSearchKeys).toBe("function")
    expect(typeof repo.getKeywordSearchList).toBe("function")
  })

  it("getRegions가 기본 categoryCode로 호출한다", async () => {
    const http = createMockHttp()
    const repo = new ApiSearchRepository(http)
    await repo.getRegions()

    expect(http.get).toHaveBeenCalledWith("/contents/regions/list", {
      category_code: "ALL,SUBWAY",
    })
  })

  it("getContentsList가 파라미터를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiSearchRepository(http)
    await repo.getContentsList({ search_type: "ST001", search_extra: "강남" })

    expect(http.get).toHaveBeenCalledWith("/contents/list", expect.objectContaining({
      search_type: "ST001",
      search_extra: "강남",
    }))
  })

  it("getFilterList가 POST로 filters를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiSearchRepository(http)
    const filters = [{ key: "k1" }] as never[]

    await repo.getFilterList({ checkIn: "20260101", checkOut: "20260102" }, filters)

    expect(http.post).toHaveBeenCalledWith(
      "/contents/filter/list",
      { filters },
      expect.objectContaining({ checkIn: "20260101" }),
    )
  })
})
