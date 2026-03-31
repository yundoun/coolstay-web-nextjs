import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: vi.fn() },
}))

import { getTermList } from "../termsApi"

beforeEach(() => { vi.clearAllMocks() })

describe("getTermList (P4-5)", () => {
  it("GET /manage/terms/list를 호출한다", async () => {
    const mockResponse = { terms: [{ code: "T100", name: "이용약관", url: "https://...", required_yn: "Y", version: "1.0" }] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getTermList()

    expect(mockGet).toHaveBeenCalledWith("/manage/terms/list", undefined)
    expect(result.terms).toHaveLength(1)
  })

  it("특정 약관 코드로 조회할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ terms: [] })

    await getTermList({ term_code: "T100" })

    expect(mockGet).toHaveBeenCalledWith("/manage/terms/list", { term_code: "T100" })
  })
})
