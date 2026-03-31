import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: vi.fn() },
}))

import { getEventList } from "../eventApi"

beforeEach(() => { vi.clearAllMocks() })

describe("getEventList (P4-3)", () => {
  it("GET /manage/event/list를 호출한다", async () => {
    const mockResponse = { events: [{ key: "1", title: "봄 이벤트" }] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getEventList()

    expect(mockGet).toHaveBeenCalledWith("/manage/event/list", undefined)
    expect(result.events).toHaveLength(1)
  })

  it("파라미터를 전달할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ events: [] })

    await getEventList({ status: "ACTIVE", count: 10 })

    expect(mockGet).toHaveBeenCalledWith("/manage/event/list", {
      status: "ACTIVE",
      count: 10,
    })
  })
})
