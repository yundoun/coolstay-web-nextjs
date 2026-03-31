import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: vi.fn(), post: mockPost },
}))

import { deleteMileageStores } from "../mileageApi"

beforeEach(() => {
  vi.clearAllMocks()
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
