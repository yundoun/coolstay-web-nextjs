// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ErrorState } from "../error-state"

describe("ErrorState", () => {
  it("에러 메시지를 렌더링한다", () => {
    render(<ErrorState message="데이터를 불러올 수 없습니다" />)
    expect(screen.getByText("데이터를 불러올 수 없습니다")).toBeDefined()
    expect(screen.getByRole("alert")).toBeDefined()
  })

  it("기본 에러 메시지를 표시한다", () => {
    render(<ErrorState />)
    expect(screen.getByText("오류가 발생했습니다")).toBeDefined()
  })

  it("재시도 버튼을 누르면 onRetry가 호출된다", () => {
    const onRetry = vi.fn()
    render(<ErrorState message="에러" onRetry={onRetry} />)
    fireEvent.click(screen.getByText("다시 시도"))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("onRetry가 없으면 재시도 버튼이 없다", () => {
    render(<ErrorState message="에러" />)
    expect(screen.queryByText("다시 시도")).toBeNull()
  })

  it("fullPage이면 min-h-[50vh] 컨테이너를 사용한다", () => {
    const { container } = render(<ErrorState fullPage />)
    expect(container.firstElementChild?.classList.contains("min-h-[50vh]")).toBe(true)
  })
})
