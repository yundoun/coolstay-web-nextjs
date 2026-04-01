import type { SortOption } from "../types"

export const sortOptions: SortOption[] = [
  { value: "recommend", label: "추천순" },
  { value: "like", label: "찜 많은순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "mileage", label: "마일리지순" },
  { value: "popular", label: "인기순" },
]
