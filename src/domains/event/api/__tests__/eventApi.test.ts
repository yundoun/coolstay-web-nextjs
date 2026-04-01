import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: vi.fn() },
}))

import { getEventList, getEventDetail } from "../eventApi"

beforeEach(() => { vi.clearAllMocks() })

describe("getEventList", () => {
  it("board_type=EVENT로 board/list를 호출한다", async () => {
    const mockResponse = { board_items: [{ key: 1, title: "봄 이벤트" }] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getEventList()

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "EVENT",
    })
    expect(result.board_items).toHaveLength(1)
  })

  it("파라미터를 전달할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ board_items: [] })

    await getEventList({ status: "ACTIVE", count: 10 })

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "EVENT",
      status: "ACTIVE",
      count: 10,
    })
  })
})

describe("getEventDetail", () => {
  it("board_item_key로 개별 조회한다", async () => {
    const mockResponse = { board_items: [{ key: 87226, title: "이벤트" }] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getEventDetail(87226)

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "EVENT",
      board_item_key: "87226",
    })
    expect(result.board_items[0].key).toBe(87226)
  })
})
