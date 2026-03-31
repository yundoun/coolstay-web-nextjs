// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Gift } from "lucide-react"
import { EmptyState } from "../empty-state"

describe("EmptyState", () => {
  it("제목과 설명을 렌더링한다", () => {
    render(
      <EmptyState
        icon={Gift}
        title="보유한 쿠폰이 없습니다"
        description="이벤트에서 다양한 쿠폰을 받아보세요"
      />
    )
    expect(screen.getByText("보유한 쿠폰이 없습니다")).toBeDefined()
    expect(screen.getByText("이벤트에서 다양한 쿠폰을 받아보세요")).toBeDefined()
  })

  it("아이콘을 렌더링한다", () => {
    const { container } = render(
      <EmptyState icon={Gift} title="없음" />
    )
    expect(container.querySelector("svg")).toBeDefined()
  })

  it("action을 렌더링한다", () => {
    render(
      <EmptyState
        icon={Gift}
        title="없음"
        action={{ label: "이벤트 보러가기", href: "/events" }}
      />
    )
    const link = screen.getByRole("link", { name: "이벤트 보러가기" })
    expect(link.getAttribute("href")).toBe("/events")
  })

  it("action이 없으면 버튼이 없다", () => {
    render(<EmptyState icon={Gift} title="없음" />)
    expect(screen.queryByRole("link")).toBeNull()
  })

  it("description이 없으면 설명 텍스트가 없다", () => {
    const { container } = render(<EmptyState icon={Gift} title="없음" />)
    expect(container.querySelectorAll(".text-muted-foreground").length).toBe(1) // icon only
  })
})
