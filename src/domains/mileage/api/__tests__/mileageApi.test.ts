import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import { getMileageDetail, deleteMileageStores } from "../mileageApi"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getMileageDetail (P2-8)", () => {
  it("GET /benefit/users/mileage/list에 store_key를 전달한다", async () => {
    const mockResponse = {
      amount: 5000,
      total_amount: 12000,
      expire_amount: 2000,
      points: [
        { key: "p1", amount: 3000, remained_point: 3000, status: "ACTIVE", reason: "숙박 적립" },
      ],
    }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getMileageDetail({ store_key: "store-123" })

    expect(mockGet).toHaveBeenCalledWith("/benefit/users/mileage/list", {
      store_key: "store-123",
    })
    expect(result.amount).toBe(5000)
    expect(result.points).toHaveLength(1)
  })
})

describe("deleteMileageStores (P2-8)", () => {
  it("POST /benefit/mileage/delete에 store_keys를 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteMileageStores({ store_keys: ["store-1", "store-2"] })

    expect(mockPost).toHaveBeenCalledWith("/benefit/mileage/delete", {
      store_keys: ["store-1", "store-2"],
    })
  })

  it("flag를 포함하여 전달할 수 있다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteMileageStores({ store_keys: ["store-1"], flag: "ALL" })

    expect(mockPost).toHaveBeenCalledWith("/benefit/mileage/delete", {
      store_keys: ["store-1"],
      flag: "ALL",
    })
  })
})
