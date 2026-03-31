// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { LoadingSpinner } from "../loading-spinner"

describe("LoadingSpinner", () => {
  it("기본 스피너를 렌더링한다", () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole("status")).toBeDefined()
    expect(screen.getByText("로딩 중")).toBeDefined()
  })

  it("커스텀 메시지를 표시한다", () => {
    render(<LoadingSpinner message="데이터를 불러오는 중..." />)
    expect(screen.getByText("데이터를 불러오는 중...")).toBeDefined()
  })

  it("size=sm이면 작은 아이콘을 렌더링한다", () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const svg = container.querySelector("svg")
    expect(svg?.classList.contains("size-5")).toBe(true)
  })

  it("size=lg이면 큰 아이콘을 렌더링한다", () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    const svg = container.querySelector("svg")
    expect(svg?.classList.contains("size-12")).toBe(true)
  })

  it("fullPage이면 min-h-[50vh] 컨테이너를 사용한다", () => {
    const { container } = render(<LoadingSpinner fullPage />)
    expect(container.firstElementChild?.classList.contains("min-h-[50vh]")).toBe(true)
  })

  it("className을 전달할 수 있다", () => {
    const { container } = render(<LoadingSpinner className="my-custom" />)
    expect(container.firstElementChild?.classList.contains("my-custom")).toBe(true)
  })
})
