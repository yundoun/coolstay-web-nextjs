import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import { getAlarmList, updateAlarmCard, deleteAlarms } from "../alarmApi"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getAlarmList (P3-1)", () => {
  it("GET /auth/alarms/users/list를 호출한다", async () => {
    const mockResponse = { total_count: 3, next_cursor: "", alarms: [] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getAlarmList()

    expect(mockGet).toHaveBeenCalledWith("/auth/alarms/users/list", undefined)
    expect(result.total_count).toBe(3)
  })

  it("category와 페이지네이션 파라미터를 전달할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ total_count: 0, alarms: [] })

    await getAlarmList({ category: "BOOKING", count: 20, cursor: "abc" })

    expect(mockGet).toHaveBeenCalledWith("/auth/alarms/users/list", {
      category: "BOOKING",
      count: 20,
      cursor: "abc",
    })
  })
})

describe("updateAlarmCard (P3-3)", () => {
  it("POST /auth/alarms/card/update에 읽음 처리 대상을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await updateAlarmCard({ type: "READ", alarm_key: [1, 2, 3] })

    expect(mockPost).toHaveBeenCalledWith("/auth/alarms/card/update", {
      type: "READ",
      alarm_key: [1, 2, 3],
    })
  })
})

describe("deleteAlarms (P3-2)", () => {
  it("POST /auth/alarms/delete에 삭제 대상을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteAlarms({ delete_type: "SELECT", alarm_key: [1, 2] })

    expect(mockPost).toHaveBeenCalledWith("/auth/alarms/delete", {
      delete_type: "SELECT",
      alarm_key: [1, 2],
    })
  })
})
