// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { BoardListResponse } from "@/domains/cs/types"

// next/image 모킹
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props
    return <img {...rest} />
  },
}))

// getGuideList 모킹
const mockGetGuideList = vi.fn<() => Promise<BoardListResponse>>()
vi.mock("@/domains/cs/api/csApi", () => ({
  getGuideList: (...args: unknown[]) => mockGetGuideList(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GuidePage", () => {
  it("로딩 중 스피너를 표시한다", async () => {
    mockGetGuideList.mockReturnValue(new Promise(() => {})) // never resolves

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    expect(screen.getByRole("status")).toBeTruthy()
  })

  it("API 에러 시 에러 상태를 표시한다", async () => {
    mockGetGuideList.mockRejectedValue(new Error("network error"))

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    const errorAlert = await screen.findByRole("alert")
    expect(errorAlert).toBeTruthy()
    expect(screen.getByText("가이드를 불러오지 못했습니다")).toBeTruthy()
    expect(screen.getByText("다시 시도")).toBeTruthy()
  })

  it("가이드가 없으면 빈 상태를 표시한다", async () => {
    mockGetGuideList.mockResolvedValue({
      total_count: 0,
      board_items: [],
    })

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    expect(
      await screen.findByText("등록된 가이드가 없습니다")
    ).toBeTruthy()
  })

  it("API 데이터로 가이드 목록을 렌더링한다", async () => {
    mockGetGuideList.mockResolvedValue({
      total_count: 2,
      board_items: [
        {
          key: "g1",
          type: "GUIDE",
          title: "숙소 이용 가이드",
          description: "체크인 방법을 알아보세요",
          status: "ACTIVE",
        },
        {
          key: "g2",
          type: "GUIDE",
          title: "할인 쿠폰 사용법",
          description: "쿠폰 적용 방법 안내",
          status: "ACTIVE",
        },
      ],
    })

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    expect(await screen.findByText("숙소 이용 가이드")).toBeTruthy()
    expect(screen.getByText("할인 쿠폰 사용법")).toBeTruthy()
    expect(screen.getByText("체크인 방법을 알아보세요")).toBeTruthy()
    expect(screen.getByText("쿠폰 적용 방법 안내")).toBeTruthy()
  })
})
