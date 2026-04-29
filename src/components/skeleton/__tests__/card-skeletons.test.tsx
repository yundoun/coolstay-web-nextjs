// @vitest-environment jsdom
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  AccommodationCardSkeleton,
  RegionCardSkeleton,
  WishlistCardSkeleton,
  EventCardSkeleton,
  BoardCardSkeleton,
  PackageCardSkeleton,
  MagazineCardSkeleton,
} from "../card-skeletons"

const skeletonComponents = [
  { name: "AccommodationCardSkeleton", Component: AccommodationCardSkeleton },
  { name: "RegionCardSkeleton", Component: RegionCardSkeleton },
  { name: "WishlistCardSkeleton", Component: WishlistCardSkeleton },
  { name: "EventCardSkeleton", Component: EventCardSkeleton },
  { name: "BoardCardSkeleton", Component: BoardCardSkeleton },
  { name: "PackageCardSkeleton", Component: PackageCardSkeleton },
  { name: "MagazineCardSkeleton", Component: MagazineCardSkeleton },
]

describe("카드 스켈레톤 컴포넌트", () => {
  skeletonComponents.forEach(({ name, Component }) => {
    describe(name, () => {
      it("렌더링된다", () => {
        const { container } = render(<Component />)
        expect(container.firstElementChild).toBeTruthy()
      })

      it("Skeleton 요소를 포함한다", () => {
        const { container } = render(<Component />)
        const skeletons = container.querySelectorAll("[data-slot='skeleton']")
        expect(skeletons.length).toBeGreaterThan(0)
      })

      it("className을 확장할 수 있다", () => {
        const { container } = render(<Component className="custom-class" />)
        const el = container.firstElementChild!
        expect(el.classList.contains("custom-class")).toBe(true)
      })
    })
  })

  describe("AccommodationCardSkeleton", () => {
    it("2열 가격 그리드를 포함한다", () => {
      const { container } = render(<AccommodationCardSkeleton />)
      const grid = container.querySelector(".grid-cols-2")
      expect(grid).toBeTruthy()
    })

    it("하단 플래그 바 영역이 있다", () => {
      const { container } = render(<AccommodationCardSkeleton />)
      const flagBar = container.querySelector(".h-\\[30px\\]")
      expect(flagBar).toBeTruthy()
    })
  })

  describe("MagazineCardSkeleton", () => {
    it("200px 고정 너비를 가진다", () => {
      const { container } = render(<MagazineCardSkeleton />)
      const el = container.firstElementChild!
      expect(el.classList.contains("w-[200px]")).toBe(true)
    })
  })
})
