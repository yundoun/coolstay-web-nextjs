import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import { getFriendRecommend, registerFriendCode } from "../friendApi"

beforeEach(() => { vi.clearAllMocks() })

describe("getFriendRecommend (P4-6)", () => {
  it("GET /auth/users/friend/list를 호출한다", async () => {
    const mockResponse = { friend_info: { my_recommend_code: "ABC123" }, friend_event: null, button: null }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getFriendRecommend()

    expect(mockGet).toHaveBeenCalledWith("/auth/users/friend/list")
    expect(result.friend_info?.my_recommend_code).toBe("ABC123")
  })
})

describe("registerFriendCode (P4-6)", () => {
  it("POST /auth/users/friend/register에 추천 코드를 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await registerFriendCode({ recommend_code: "XYZ789" })

    expect(mockPost).toHaveBeenCalledWith("/auth/users/friend/register", {
      recommend_code: "XYZ789",
    })
  })
})
