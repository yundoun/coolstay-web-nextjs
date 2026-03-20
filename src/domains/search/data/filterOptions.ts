import type { RegionOption, SortOption } from "../types"

// 지역 필터 옵션
export const regionOptions: RegionOption[] = [
  { value: "jeju", label: "제주", accommodationCount: 2341 },
  { value: "busan", label: "부산", accommodationCount: 1892 },
  { value: "gangneung", label: "강릉", accommodationCount: 987 },
  { value: "gyeongju", label: "경주", accommodationCount: 756 },
  { value: "yeosu", label: "여수", accommodationCount: 643 },
  { value: "sokcho", label: "속초", accommodationCount: 521 },
  { value: "jeonju", label: "전주", accommodationCount: 432 },
  { value: "seoul", label: "서울", accommodationCount: 3201 },
]

// 정렬 옵션 (모바일 앱 기반: RATING, PRICE_LOW, PRICE_HIGH, BENEFIT_MILEAGE, USER_LIKE)
export const sortOptions: SortOption[] = [
  { value: "recommend", label: "추천순" },
  { value: "rating", label: "평점 높은순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "mileage", label: "마일리지순" },
  { value: "popular", label: "인기순" },
]

// 지역 라벨 맵
export const regionLabels: Record<string, string> = {
  jeju: "제주",
  busan: "부산",
  gangneung: "강릉",
  gyeongju: "경주",
  yeosu: "여수",
  sokcho: "속초",
  jeonju: "전주",
  seoul: "서울",
}
