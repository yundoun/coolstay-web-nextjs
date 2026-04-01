// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import type { BoardItem } from "@/domains/cs/types"

// next/image mock
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props
    return <img data-fill={fill ? "true" : undefined} {...rest} />
  },
}))

// useEventList mock
const mockUseEventList = vi.fn<() => {
  events: BoardItem[]
  isLoading: boolean
  error: string | null
}>()

vi.mock("../../hooks/useEventList", () => ({
  useEventList: () => mockUseEventList(),
}))

import { EventListPage } from "../EventListPage"

const mockEvents: BoardItem[] = [
  {
    key: "evt-1",
    type: "EVENT",
    title: "봄맞이 할인 이벤트",
    description: "봄 시즌 특별 할인",
    banner_image_url: "https://example.com/spring.jpg",
    start_dt: 1711900800000,
    end_dt: 1714492800000,
    status: "ACTIVE",
  },
  {
    key: "evt-2",
    type: "EVENT",
    title: "종료된 이벤트",
    description: "이미 종료됨",
    banner_image_url: "https://example.com/ended.jpg",
    status: "END",
  },
  {
    key: "evt-3",
    type: "EVENT",
    title: "예정된 이벤트",
    description: "곧 시작 예정",
    banner_image_url: "https://example.com/upcoming.jpg",
    status: "WAIT",
  },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe("EventListPage", () => {
  describe("로딩 상태", () => {
    it("isLoading이 true일 때 로딩 스피너를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [],
        isLoading: true,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("이벤트")).toBeTruthy()
      expect(screen.getByRole("status")).toBeTruthy()
    })
  })

  describe("에러 상태", () => {
    it("error가 존재하면 에러 메시지를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [],
        isLoading: false,
        error: "네트워크 오류가 발생했습니다",
      })

      render(<EventListPage />)

      expect(screen.getByText("네트워크 오류가 발생했습니다")).toBeTruthy()
    })
  })

  describe("이벤트 목록 렌더링", () => {
    it("이벤트 목록을 올바르게 렌더링한다", () => {
      mockUseEventList.mockReturnValue({
        events: mockEvents,
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("봄맞이 할인 이벤트")).toBeTruthy()
      expect(screen.getByText("종료된 이벤트")).toBeTruthy()
      expect(screen.getByText("예정된 이벤트")).toBeTruthy()
    })

    it("이벤트가 없으면 빈 상태를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("진행 중인 이벤트가 없습니다")).toBeTruthy()
    })
  })

  describe("상태 배지", () => {
    it("ACTIVE 이벤트에 '진행중' 배지를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("진행중")).toBeTruthy()
    })

    it("END 이벤트에 '종료' 배지를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[1]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("종료")).toBeTruthy()
    })

    it("WAIT 이벤트에 '예정' 배지를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[2]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("예정")).toBeTruthy()
    })
  })
})
