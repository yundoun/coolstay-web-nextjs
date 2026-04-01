// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import type { BoardItem } from "@/domains/cs/types"

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return <img data-fill={fill ? "true" : undefined} {...rest} />
  },
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

const mockUseEventList = vi.fn<() => {
  events: BoardItem[]
  isLoading: boolean
  error: string | null
}>()

vi.mock("../../hooks/useEventList", () => ({
  useEventList: () => mockUseEventList(),
}))

import { EventListPage } from "../EventListPage"

const NOW_SEC = Math.floor(Date.now() / 1000)
const PAST_SEC = NOW_SEC - 86400 * 30
const FAR_PAST_SEC = NOW_SEC - 86400 * 60
const FUTURE_SEC = NOW_SEC + 86400 * 30
const FAR_FUTURE_SEC = NOW_SEC + 86400 * 60

const mockEvents: BoardItem[] = [
  {
    key: 87226,
    type: "VISIT",
    title: "2025 숙박세일 페스타",
    badge_image_url: "https://example.com/badge.jpg",
    thumb_description: "기획전 목록",
    view_count: 150,
    start_dt: PAST_SEC,
    end_dt: FUTURE_SEC,
    reg_dt: PAST_SEC,
  },
  {
    key: 87227,
    title: "종료된 이벤트",
    badge_image_url: "https://example.com/ended.jpg",
    start_dt: FAR_PAST_SEC,
    end_dt: PAST_SEC,
  },
  {
    key: 87228,
    title: "예정된 이벤트",
    start_dt: FUTURE_SEC,
    end_dt: FAR_FUTURE_SEC,
  },
]

beforeEach(() => vi.clearAllMocks())

describe("EventListPage", () => {
  it("로딩 중 스피너를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [], isLoading: true, error: null })
    render(<EventListPage />)
    expect(screen.getByRole("status")).toBeTruthy()
  })

  it("에러 메시지를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [], isLoading: false, error: "오류" })
    render(<EventListPage />)
    expect(screen.getByText("오류")).toBeTruthy()
  })

  it("이벤트 목록을 렌더링한다", () => {
    mockUseEventList.mockReturnValue({ events: mockEvents, isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("2025 숙박세일 페스타")).toBeTruthy()
    expect(screen.getByText("종료된 이벤트")).toBeTruthy()
    expect(screen.getByText("예정된 이벤트")).toBeTruthy()
  })

  it("빈 상태를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [], isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("진행 중인 이벤트가 없습니다")).toBeTruthy()
  })

  it("badge_image_url을 썸네일로 사용한다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[0]], isLoading: false, error: null })
    render(<EventListPage />)
    const img = screen.getByAltText("2025 숙박세일 페스타")
    expect(img.getAttribute("src")).toBe("https://example.com/badge.jpg")
  })

  it("thumb_description을 부제로 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[0]], isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("기획전 목록")).toBeTruthy()
  })

  it("진행중 이벤트에 '진행중' 배지를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[0]], isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("진행중")).toBeTruthy()
  })

  it("종료된 이벤트에 '종료' 배지를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[1]], isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("종료")).toBeTruthy()
  })

  it("예정 이벤트에 '예정' 배지를 표시한다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[2]], isLoading: false, error: null })
    render(<EventListPage />)
    expect(screen.getByText("예정")).toBeTruthy()
  })

  it("종료된 이벤트가 흐리게 표시된다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[1]], isLoading: false, error: null })
    render(<EventListPage />)
    const link = screen.getByText("종료된 이벤트").closest("a")
    expect(link?.className).toContain("opacity-60")
    expect(link?.className).toContain("grayscale")
  })

  it("상세 페이지 링크가 /events/[key]로 연결된다", () => {
    mockUseEventList.mockReturnValue({ events: [mockEvents[0]], isLoading: false, error: null })
    render(<EventListPage />)
    const link = screen.getByText("2025 숙박세일 페스타").closest("a")
    expect(link?.getAttribute("href")).toBe("/events/87226")
  })
})
