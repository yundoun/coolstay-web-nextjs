import type { LucideIcon } from "lucide-react"

// 벤토 카드 사이즈 타입
export type BentoSize = "large" | "wide" | "tall" | "small"

// 뱃지 타입
export type BadgeType = "eco" | "premium" | "localPick" | "new"

// 라이프스타일 필터 옵션
export interface LifestyleFilter {
  value: string
  label: string
  icon: string // emoji
  description: string
}

// 숙소 데이터 (확장)
export interface Search2Accommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  images?: string[] // 추가 이미지
  tags?: string[]
  badges?: BadgeType[]
  isSoldOut?: boolean
  // 벤토 그리드용
  bentoSize?: BentoSize
  // 라이프스타일 필터용
  lifestyle?: string[]
  // 로컬 정보
  localHighlight?: string
}

// 지역 이미지 데이터
export interface RegionImage {
  region: string
  label: string
  heroImage: string
  description: string
}

// 로컬 큐레이션 아이템
export interface LocalCurationItem {
  id: string
  type: "restaurant" | "cafe" | "spot" | "activity"
  name: string
  description: string
  imageUrl: string
  distance?: string
}

// 로컬 큐레이션 데이터
export interface LocalCuration {
  region: string
  title: string
  items: LocalCurationItem[]
}

// Search2 필터 상태
export interface Search2Filters {
  regions: string[]
  lifestyle: string[]
  types: string[]
  amenities: string[]
  minPrice: number
  maxPrice: number
  rating: string | null
}

// 정렬 옵션
export interface SortOption {
  value: string
  label: string
}
