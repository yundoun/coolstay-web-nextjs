// @vitest-environment jsdom
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  SectionHeaderSkeleton,
  GridSkeleton,
  ListItemSkeleton,
  DetailHeroSkeleton,
} from "../layout-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

describe("레이아웃 스켈레톤 컴포넌트", () => {
  describe("SectionHeaderSkeleton", () => {
    it("렌더링된다", () => {
      const { container } = render(<SectionHeaderSkeleton />)
      expect(container.firstElementChild).toBeTruthy()
    })

    it("제목과 액션 영역의 Skeleton을 포함한다", () => {
      const { container } = render(<SectionHeaderSkeleton />)
      const skeletons = container.querySelectorAll("[data-slot='skeleton']")
      expect(skeletons.length).toBe(3) // 제목 + 부제 + 액션
    })

    it("className을 확장할 수 있다", () => {
      const { container } = render(<SectionHeaderSkeleton className="mb-4" />)
      expect(container.firstElementChild!.classList.contains("mb-4")).toBe(true)
    })
  })

  describe("GridSkeleton", () => {
    it("지정된 rows 수만큼 children을 반복한다", () => {
      const { container } = render(
        <GridSkeleton rows={6}>
          <Skeleton className="h-10" />
        </GridSkeleton>
      )
      const items = container.querySelectorAll(".grid > div")
      expect(items.length).toBe(6)
    })

    it("기본 cols=2 그리드를 생성한다", () => {
      const { container } = render(
        <GridSkeleton>
          <Skeleton className="h-10" />
        </GridSkeleton>
      )
      expect(container.firstElementChild!.classList.contains("grid-cols-2")).toBe(true)
    })

    it("cols=3이면 반응형 그리드를 적용한다", () => {
      const { container } = render(
        <GridSkeleton cols={3}>
          <Skeleton className="h-10" />
        </GridSkeleton>
      )
      const el = container.firstElementChild!
      expect(el.classList.contains("grid-cols-1")).toBe(true)
      expect(el.classList.contains("lg:grid-cols-3")).toBe(true)
    })

    it("gap prop을 적용한다", () => {
      const { container } = render(
        <GridSkeleton gap={4}>
          <Skeleton className="h-10" />
        </GridSkeleton>
      )
      expect(container.firstElementChild!.classList.contains("gap-4")).toBe(true)
    })
  })

  describe("ListItemSkeleton", () => {
    it("기본 2줄 텍스트를 렌더링한다", () => {
      const { container } = render(<ListItemSkeleton />)
      const skeletons = container.querySelectorAll("[data-slot='skeleton']")
      expect(skeletons.length).toBe(3) // 아이콘 + 2줄
    })

    it("lines=3이면 3줄 텍스트를 렌더링한다", () => {
      const { container } = render(<ListItemSkeleton lines={3} />)
      const skeletons = container.querySelectorAll("[data-slot='skeleton']")
      expect(skeletons.length).toBe(4) // 아이콘 + 3줄
    })

    it("hasImage이면 사각형 이미지 플레이스홀더를 렌더링한다", () => {
      const { container } = render(<ListItemSkeleton hasImage />)
      const imageEl = container.querySelector(".size-16")
      expect(imageEl).toBeTruthy()
    })

    it("hasImage가 아니면 원형 아이콘 플레이스홀더를 렌더링한다", () => {
      const { container } = render(<ListItemSkeleton />)
      const circleEl = container.querySelector(".rounded-full")
      expect(circleEl).toBeTruthy()
    })
  })

  describe("DetailHeroSkeleton", () => {
    it("이미지 + 제목 + 메타 영역을 렌더링한다", () => {
      const { container } = render(<DetailHeroSkeleton />)
      const skeletons = container.querySelectorAll("[data-slot='skeleton']")
      expect(skeletons.length).toBeGreaterThanOrEqual(5)
    })

    it("기본 이미지 비율은 2:1이다", () => {
      const { container } = render(<DetailHeroSkeleton />)
      const image = container.querySelector(".aspect-\\[2\\/1\\]")
      expect(image).toBeTruthy()
    })

    it("커스텀 이미지 비율을 지정할 수 있다", () => {
      const { container } = render(<DetailHeroSkeleton imageAspect="aspect-video" />)
      const image = container.querySelector(".aspect-video")
      expect(image).toBeTruthy()
    })
  })
})
