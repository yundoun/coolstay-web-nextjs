// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { BoardListResponse } from "@/domains/cs/types"

// next/image 모킹
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return <img data-fill={fill ? "true" : undefined} {...rest} />
  },
}))

// formatTimestampDot 모킹
vi.mock("@/lib/utils/formatDate", () => ({
  formatTimestampDot: (v: number) => {
    if (!v) return ""
    const d = new Date(v < 10_000_000_000 ? v * 1000 : v)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
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

const MOCK_GUIDES: BoardListResponse = {
  total_count: 2,
  board_items: [
    {
      key: 13426,
      title: "꿀팁222222",
      image_urls: [
        "https://storage.googleapis.com/image1.jpg",
        "https://storage.googleapis.com/image2.png",
      ],
      link: {
        type: "APP_LINK",
        sub_type: "A_MR_24",
        target: "12848",
        btn_name: "이벤트 상세",
      },
      view_count: 6,
      reg_dt: 1727399964,
    },
    {
      key: 13500,
      title: "할인 쿠폰 사용법",
      image_urls: ["https://storage.googleapis.com/image3.jpg"],
      view_count: 12,
      reg_dt: 1727486364,
    },
  ],
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
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    expect(await screen.findByText("꿀팁222222")).toBeTruthy()
    expect(screen.getByText("할인 쿠폰 사용법")).toBeTruthy()
  })

  it("image_urls[0]을 썸네일로 표시한다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    await screen.findByText("꿀팁222222")
    const images = screen.getAllByRole("img")
    const thumbnail = images.find(
      (img) => img.getAttribute("src") === "https://storage.googleapis.com/image1.jpg"
    )
    expect(thumbnail).toBeTruthy()
  })

  it("view_count를 표시한다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    await screen.findByText("꿀팁222222")
    expect(screen.getByText("6")).toBeTruthy()
    expect(screen.getByText("12")).toBeTruthy()
  })

  it("가이드 클릭 시 상세 뷰를 표시한다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    const guideButton = await screen.findByText("꿀팁222222")
    fireEvent.click(guideButton.closest("button")!)

    // 상세 뷰에서 타이틀이 보여야 한다
    expect(screen.getByText("꿀팁222222")).toBeTruthy()
    // 뒤로가기 버튼이 보여야 한다
    expect(screen.getByText("가이드 목록")).toBeTruthy()
  })

  it("상세 뷰에서 모든 image_urls 이미지를 갤러리로 표시한다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    const guideButton = await screen.findByText("꿀팁222222")
    fireEvent.click(guideButton.closest("button")!)

    const images = screen.getAllByRole("img")
    const galleryUrls = images.map((img) => img.getAttribute("src"))
    expect(galleryUrls).toContain("https://storage.googleapis.com/image1.jpg")
    expect(galleryUrls).toContain("https://storage.googleapis.com/image2.png")
  })

  it("상세 뷰에서 link.btn_name이 있으면 CTA 버튼을 표시한다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    const guideButton = await screen.findByText("꿀팁222222")
    fireEvent.click(guideButton.closest("button")!)

    expect(screen.getByText("이벤트 상세")).toBeTruthy()
  })

  it("상세 뷰에서 link가 없으면 CTA 버튼을 표시하지 않는다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    // link가 없는 두 번째 가이드 클릭
    const guideButton = await screen.findByText("할인 쿠폰 사용법")
    fireEvent.click(guideButton.closest("button")!)

    expect(screen.queryByText("이벤트 상세")).toBeNull()
  })

  it("상세 뷰에서 뒤로가기 버튼 클릭 시 목록으로 돌아간다", async () => {
    mockGetGuideList.mockResolvedValue(MOCK_GUIDES)

    const { GuidePage } = await import("../GuidePage")
    render(<GuidePage />, { wrapper: createWrapper() })

    const guideButton = await screen.findByText("꿀팁222222")
    fireEvent.click(guideButton.closest("button")!)

    // 뒤로가기 클릭
    const backButton = screen.getByText("가이드 목록")
    fireEvent.click(backButton.closest("button")!)

    // 목록이 다시 보여야 한다
    expect(screen.getByText("꿀팁222222")).toBeTruthy()
    expect(screen.getByText("할인 쿠폰 사용법")).toBeTruthy()
  })
})
