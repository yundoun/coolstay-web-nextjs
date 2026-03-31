import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import {
  getNoticeList,
  getFaqList,
  getInquiryList,
  registerInquiry,
  deleteInquiry,
} from "../csApi"

beforeEach(() => {
  vi.clearAllMocks()
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P3-5: 공지사항
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("getNoticeList (P3-5)", () => {
  it("GET /manage/board/list에 board_type=NOTICE를 전달한다", async () => {
    const mockResponse = { total_count: 5, board_items: [] }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getNoticeList()

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "NOTICE",
    })
    expect(result.total_count).toBe(5)
  })

  it("특정 공지사항을 조회할 수 있다", async () => {
    mockGet.mockResolvedValueOnce({ total_count: 1, board_items: [] })

    await getNoticeList({ board_item_key: "notice-123" })

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "NOTICE",
      board_item_key: "notice-123",
    })
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P3-6: FAQ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("getFaqList (P3-6)", () => {
  it("GET /manage/board/list에 board_type=FAQ를 전달한다", async () => {
    mockGet.mockResolvedValueOnce({ total_count: 10, board_items: [] })

    const result = await getFaqList()

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "FAQ",
    })
    expect(result.total_count).toBe(10)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P3-4: 1:1 문의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("getInquiryList (P3-4)", () => {
  it("GET /manage/board/list에 board_type=INQUIRY를 전달한다", async () => {
    mockGet.mockResolvedValueOnce({ total_count: 2, board_items: [] })

    const result = await getInquiryList()

    expect(mockGet).toHaveBeenCalledWith("/manage/board/list", {
      board_type: "INQUIRY",
    })
    expect(result.total_count).toBe(2)
  })
})

describe("registerInquiry (P3-4)", () => {
  it("POST /manage/board/register에 문의 내용을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await registerInquiry({ board_type: "INQUIRY", title: "문의합니다" })

    expect(mockPost).toHaveBeenCalledWith("/manage/board/register", {
      board_type: "INQUIRY",
      title: "문의합니다",
    })
  })
})

describe("deleteInquiry (P3-4)", () => {
  it("POST /manage/board/delete에 삭제 대상을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteInquiry({ board_type: "INQUIRY", item_key: "inq-123" })

    expect(mockPost).toHaveBeenCalledWith("/manage/board/delete", {
      board_type: "INQUIRY",
      item_key: "inq-123",
    })
  })
})
