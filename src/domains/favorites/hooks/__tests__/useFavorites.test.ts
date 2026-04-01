// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"

const { mockGetDibsList, mockRegisterDibs, mockDeleteDibs } = vi.hoisted(() => ({
  mockGetDibsList: vi.fn(),
  mockRegisterDibs: vi.fn(),
  mockDeleteDibs: vi.fn(),
}))
vi.mock("@/domains/mypage/api/mypageApi", () => ({
  getDibsList: mockGetDibsList,
  registerDibs: mockRegisterDibs,
  deleteDibs: mockDeleteDibs,
}))

import { useFavorites } from "../useFavorites"

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useFavorites", () => {
  it("마운트 시 찜 목록을 조회한다", async () => {
    mockGetDibsList.mockResolvedValueOnce({
      total_count: 2,
      next_cursor: "",
      motels: [
        {
          key: "store-1",
          name: "테스트 숙소 1",
          like_count: 10,
          user_like_yn: "Y",
          images: [],
          items: [],
        },
        {
          key: "store-2",
          name: "테스트 숙소 2",
          like_count: 5,
          user_like_yn: "Y",
          images: [],
          items: [],
        },
      ],
    })

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    })

    // 로딩 상태 확인
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetDibsList).toHaveBeenCalledWith({ count: 100 })
    expect(result.current.wishlistItems).toHaveLength(2)
    expect(result.current.wishlistItems[0].key).toBe("store-1")
    expect(result.current.totalCount).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it("에러 발생 시 error를 반환한다", async () => {
    mockGetDibsList.mockRejectedValue(new Error("인증이 필요합니다"))

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    })

    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull()
      },
      { timeout: 5000 }
    )

    expect(result.current.error).toBe("인증이 필요합니다")
    expect(result.current.wishlistItems).toEqual([])
  })

  it("데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGetDibsList.mockResolvedValueOnce({
      total_count: 0,
      next_cursor: "",
      motels: [],
    })

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.wishlistItems).toEqual([])
    expect(result.current.totalCount).toBe(0)
    expect(result.current.error).toBeNull()
  })
})
