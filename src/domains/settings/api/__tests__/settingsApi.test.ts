import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import { getUserSettings, updateUserSettings } from "../settingsApi"

beforeEach(() => { vi.clearAllMocks() })

describe("getUserSettings (P4-1)", () => {
  it("GET /auth/users/settings/list를 호출한다", async () => {
    const mockResponse = { settings: [{ code: "US002", value: "Y" }] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getUserSettings()

    expect(mockGet).toHaveBeenCalledWith("/auth/users/settings/list")
    expect(result.settings).toHaveLength(1)
  })
})

describe("updateUserSettings (P4-2)", () => {
  it("POST /auth/users/settings/update에 설정값을 전달한다", async () => {
    const settings = [{ code: "US002", value: "N" }]
    mockPost.mockResolvedValueOnce({ settings })

    const result = await updateUserSettings({ settings })

    expect(mockPost).toHaveBeenCalledWith("/auth/users/settings/update", { settings })
    expect(result.settings[0].value).toBe("N")
  })
})
