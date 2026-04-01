// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import type { BoardItem } from "@/domains/cs/types"

// next/image mock
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return (
      <img
        data-fill={fill ? "true" : undefined}
        data-priority={priority ? "true" : undefined}
        {...rest}
      />
    )
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

// Timestamps in SECONDS (matching real API)
const NOW_SEC = Math.floor(Date.now() / 1000)
const PAST_SEC = NOW_SEC - 86400 * 30 // 30 days ago
const FAR_PAST_SEC = NOW_SEC - 86400 * 60 // 60 days ago
const FUTURE_SEC = NOW_SEC + 86400 * 30 // 30 days from now
const FAR_FUTURE_SEC = NOW_SEC + 86400 * 60 // 60 days from now

const mockEvents: BoardItem[] = [
  {
    key: 87226,
    type: "VISIT",
    title: "2025 숙박세일 페스타",
    description: "<p>봄 시즌 특별 할인</p>",
    badge_image_url: "https://example.com/badge-spring.jpg",
    detail_banner_image_url: "https://example.com/detail-spring.jpg",
    webview_link: "http://ggulstay.co.kr/event/spring",
    image_urls: [
      "https://example.com/gallery1.jpg",
      "https://example.com/gallery2.jpg",
    ],
    buttons: [
      {
        type: "URL_DETAIL",
        sub_type: "1",
        target: "http://ggulstay.co.kr/event/coupon",
        btn_name: "쿠폰 받으러가기",
      },
    ],
    thumb_description: "기획전 목록",
    status: "BI005",
    view_count: 150,
    start_dt: PAST_SEC,
    end_dt: FUTURE_SEC,
    reg_dt: PAST_SEC,
  },
  {
    key: 87227,
    type: "COUPON",
    title: "종료된 이벤트",
    description: "이미 종료됨",
    badge_image_url: "https://example.com/badge-ended.jpg",
    detail_banner_image_url: "https://example.com/detail-ended.jpg",
    status: "BI006",
    start_dt: FAR_PAST_SEC,
    end_dt: PAST_SEC,
  },
  {
    key: 87228,
    type: "VISIT",
    title: "예정된 이벤트",
    description: "곧 시작 예정",
    badge_image_url: "https://example.com/badge-upcoming.jpg",
    status: "BI005",
    start_dt: FUTURE_SEC,
    end_dt: FAR_FUTURE_SEC,
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

      expect(screen.getByText("2025 숙박세일 페스타")).toBeTruthy()
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

    it("badge_image_url을 카드 썸네일로 사용한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      const img = screen.getByAltText("2025 숙박세일 페스타")
      expect(img.getAttribute("src")).toBe(
        "https://example.com/badge-spring.jpg"
      )
    })

    it("thumb_description을 부제목으로 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("기획전 목록")).toBeTruthy()
    })
  })

  describe("날짜 기반 상태 배지", () => {
    it("진행 중인 이벤트에 '진행중' 배지를 표시한다 (start_dt < now < end_dt)", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("진행중")).toBeTruthy()
    })

    it("종료된 이벤트에 '종료' 배지를 표시한다 (now > end_dt)", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[1]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("종료")).toBeTruthy()
    })

    it("예정된 이벤트에 '예정' 배지를 표시한다 (now < start_dt)", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[2]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      expect(screen.getByText("예정")).toBeTruthy()
    })

    it("종료된 이벤트 카드가 흐리게 표시된다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[1]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      const button = screen.getByRole("button")
      expect(button.className).toContain("opacity-60")
      expect(button.className).toContain("grayscale")
    })
  })

  describe("상세 보기", () => {
    it("카드 클릭 시 상세 화면으로 전환된다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)

      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      // Detail view should show back button
      expect(screen.getByText("이벤트 목록")).toBeTruthy()
    })

    it("detail_banner_image_url을 히어로 이미지로 사용한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      const img = screen.getByAltText("2025 숙박세일 페스타")
      expect(img.getAttribute("src")).toBe(
        "https://example.com/detail-spring.jpg"
      )
    })

    it("HTML이 포함된 description을 렌더링한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      const descEl = screen.getByTestId("event-description")
      expect(descEl.innerHTML).toContain("<p>봄 시즌 특별 할인</p>")
    })

    it("image_urls를 이미지 갤러리로 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      const gallery = screen.getByTestId("image-gallery")
      expect(gallery).toBeTruthy()

      const galleryImages = gallery.querySelectorAll("img")
      expect(galleryImages).toHaveLength(2)
    })

    it("buttons[]를 CTA 버튼으로 렌더링한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      const ctaSection = screen.getByTestId("cta-buttons")
      expect(ctaSection).toBeTruthy()

      const link = screen.getByText("쿠폰 받으러가기")
      expect(link.closest("a")?.getAttribute("href")).toBe(
        "http://ggulstay.co.kr/event/coupon"
      )
    })

    it("webview_link가 있으면 '자세히 보기' 링크를 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      const detailLink = screen.getByText("자세히 보기")
      expect(detailLink.closest("a")?.getAttribute("href")).toBe(
        "http://ggulstay.co.kr/event/spring"
      )
    })

    it("뒤로가기 버튼 클릭 시 목록으로 돌아간다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      // Now in detail view
      expect(screen.getByText("이벤트 목록")).toBeTruthy()

      fireEvent.click(screen.getByText("이벤트 목록"))

      // Should be back in list view
      expect(screen.getByText("2025 숙박세일 페스타")).toBeTruthy()
      expect(screen.queryByText("이벤트 목록")).toBeNull()
    })

    it("이벤트 타입을 배지로 표시한다", () => {
      mockUseEventList.mockReturnValue({
        events: [mockEvents[0]],
        isLoading: false,
        error: null,
      })

      render(<EventListPage />)
      fireEvent.click(screen.getByText("2025 숙박세일 페스타"))

      expect(screen.getByText("VISIT")).toBeTruthy()
    })
  })
})
