import {
  Hotel,
  Building2,
  Home,
  Tent,
  Sparkles,
  Utensils,
  Waves,
  Dumbbell,
  ParkingCircle,
  Wifi,
  AirVent,
  Coffee,
} from "lucide-react"
import type {
  RegionOption,
  AccommodationTypeOption,
  AmenityOption,
  RatingOption,
  SortOption,
} from "../types"

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

// 숙소 유형 필터 옵션
export const accommodationTypeOptions: AccommodationTypeOption[] = [
  { value: "hotel", label: "호텔", icon: Hotel },
  { value: "resort", label: "리조트", icon: Building2 },
  { value: "pension", label: "펜션", icon: Home },
  { value: "glamping", label: "글램핑", icon: Tent },
  { value: "boutique", label: "부티크호텔", icon: Sparkles },
]

// 편의시설 필터 옵션
export const amenityOptions: AmenityOption[] = [
  { value: "breakfast", label: "조식포함", icon: Utensils },
  { value: "pool", label: "수영장", icon: Waves },
  { value: "fitness", label: "피트니스", icon: Dumbbell },
  { value: "parking", label: "주차장", icon: ParkingCircle },
  { value: "wifi", label: "무료 와이파이", icon: Wifi },
  { value: "aircon", label: "에어컨", icon: AirVent },
  { value: "spa", label: "스파", icon: Sparkles },
  { value: "lounge", label: "라운지", icon: Coffee },
]

// 평점 필터 옵션
export const ratingOptions: RatingOption[] = [
  { value: "4.5", label: "4.5점 이상", minRating: 4.5 },
  { value: "4.0", label: "4.0점 이상", minRating: 4.0 },
  { value: "3.5", label: "3.5점 이상", minRating: 3.5 },
  { value: "3.0", label: "3.0점 이상", minRating: 3.0 },
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

// 필터 라벨 맵
export const filterLabels: Record<string, string> = {
  // 지역
  jeju: "제주",
  busan: "부산",
  gangneung: "강릉",
  gyeongju: "경주",
  yeosu: "여수",
  sokcho: "속초",
  jeonju: "전주",
  seoul: "서울",
  // 숙소 유형
  hotel: "호텔",
  resort: "리조트",
  pension: "펜션",
  glamping: "글램핑",
  boutique: "부티크호텔",
  // 편의시설
  breakfast: "조식포함",
  pool: "수영장",
  fitness: "피트니스",
  parking: "주차장",
  wifi: "무료 와이파이",
  aircon: "에어컨",
  spa: "스파",
  lounge: "라운지",
}
