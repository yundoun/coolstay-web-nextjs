import { describe, it, expect, vi } from "vitest"
import { ApiAccommodationRepository } from "../ApiAccommodationRepository"
import type { HttpClient } from "@/lib/ports/HttpClient"
import type { AccommodationRepository } from "../../ports/AccommodationRepository"

describe("ApiAccommodationRepository", () => {
  function createMockHttp(): HttpClient {
    return { get: vi.fn(async () => ({})), post: vi.fn(async () => ({})) }
  }

  it("AccommodationRepository 인터페이스를 구현한다", () => {
    const repo: AccommodationRepository = new ApiAccommodationRepository(createMockHttp())
    expect(typeof repo.getDetail).toBe("function")
    expect(typeof repo.getImages).toBe("function")
    expect(typeof repo.getDailyBookStatus).toBe("function")
    expect(typeof repo.getRefundPolicy).toBe("function")
  })

  it("getDetail이 기본 pure_click_yn=N을 포함한다", async () => {
    const http = createMockHttp()
    const repo = new ApiAccommodationRepository(http)
    await repo.getDetail({ motel_key: "m1" })

    expect(http.get).toHaveBeenCalledWith("/contents/details/list", expect.objectContaining({
      motel_key: "m1",
      pure_click_yn: "N",
    }))
  })

  it("getImages가 올바른 파라미터로 호출한다", async () => {
    const http = createMockHttp()
    const repo = new ApiAccommodationRepository(http)
    await repo.getImages("m1")

    expect(http.get).toHaveBeenCalledWith("/contents/images/list", { motel_key: "m1" })
  })

  it("getDailyBookStatus가 motelKey + roomKey를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiAccommodationRepository(http)
    await repo.getDailyBookStatus("m1", "r1")

    expect(http.get).toHaveBeenCalledWith("/contents/books/daystatus/list", {
      motel_key: "m1",
      room_key: "r1",
    })
  })

  it("getRefundPolicy가 파라미터를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiAccommodationRepository(http)
    await repo.getRefundPolicy({
      store_key: "s1",
      item_key: "i1",
      search_start_date: "20260101",
      search_end_date: "20260102",
    })

    expect(http.get).toHaveBeenCalledWith("/contents/refund-policy/list", expect.objectContaining({
      store_key: "s1",
      item_key: "i1",
    }))
  })
})
