import { describe, it, expect, vi } from "vitest"
import { ApiBookingRepository } from "../ApiBookingRepository"
import type { HttpClient } from "@/lib/ports/HttpClient"
import type { BookingRepository } from "../../ports/BookingRepository"

describe("ApiBookingRepository", () => {
  function createMockHttp(): HttpClient {
    return {
      get: vi.fn(async () => ({})),
      post: vi.fn(async () => ({})),
    }
  }

  it("BookingRepository 인터페이스를 구현한다", () => {
    const http = createMockHttp()
    const repo: BookingRepository = new ApiBookingRepository(http)
    expect(repo).toBeDefined()
    expect(typeof repo.getPaymentInfo).toBe("function")
    expect(typeof repo.prepare).toBe("function")
    expect(typeof repo.confirm).toBe("function")
    expect(typeof repo.getList).toBe("function")
    expect(typeof repo.getUpcoming).toBe("function")
    expect(typeof repo.cancel).toBe("function")
    expect(typeof repo.hide).toBe("function")
    expect(typeof repo.getReceiptUrl).toBe("function")
  })

  it("getPaymentInfo가 올바른 엔드포인트를 호출한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)
    await repo.getPaymentInfo("01012345678")

    expect(http.get).toHaveBeenCalledWith("/reserv/users/payments/list", {
      phone_number: "01012345678",
    })
  })

  it("prepare가 POST로 요청한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)
    const body = { motel_key: "m1", item_key: "i1" } as never

    await repo.prepare(body)
    expect(http.post).toHaveBeenCalledWith("/reserv/ready", body)
  })

  it("cancel이 올바른 body로 POST한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)

    await repo.cancel("book-123")
    expect(http.post).toHaveBeenCalledWith("/reserv/delete", { book_id: "book-123" })
  })

  it("getList가 기본 search_type을 포함한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)

    await repo.getList()
    expect(http.get).toHaveBeenCalledWith("/reserv/users/list", expect.objectContaining({
      search_type: "ST101",
    }))
  })

  it("getList가 커스텀 파라미터를 전달한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)

    await repo.getList({ reserve_type: "BEFORE", count: 10 })
    expect(http.get).toHaveBeenCalledWith("/reserv/users/list", expect.objectContaining({
      reserve_type: "BEFORE",
      count: 10,
    }))
  })

  it("getReceiptUrl이 올바른 파라미터로 호출한다", async () => {
    const http = createMockHttp()
    const repo = new ApiBookingRepository(http)

    await repo.getReceiptUrl("book-456")
    expect(http.get).toHaveBeenCalledWith("/reserv/receipt", { identifyKey: "book-456" })
  })
})
