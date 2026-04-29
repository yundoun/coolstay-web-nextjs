// @vitest-environment jsdom
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Skeleton } from "../skeleton"

describe("Skeleton", () => {
  it("기본 variant는 pulse 애니메이션을 적용한다", () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild!
    expect(el.classList.contains("animate-pulse")).toBe(true)
    expect(el.classList.contains("bg-accent")).toBe(true)
  })

  it("variant=shimmer이면 shimmer 애니메이션을 적용한다", () => {
    const { container } = render(<Skeleton variant="shimmer" />)
    const el = container.firstElementChild!
    expect(el.className).toContain("animate-[shimmer")
    expect(el.classList.contains("animate-pulse")).toBe(false)
  })

  it("data-slot=skeleton 속성을 가진다", () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector("[data-slot='skeleton']")).toBeTruthy()
  })

  it("className을 확장할 수 있다", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />)
    const el = container.firstElementChild!
    expect(el.classList.contains("h-4")).toBe(true)
    expect(el.classList.contains("w-32")).toBe(true)
  })

  it("rounded-md가 기본 적용된다", () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild!
    expect(el.classList.contains("rounded-md")).toBe(true)
  })
})
