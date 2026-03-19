// 검색 필터 타입 정의 (v1 + v2 통합)
export interface SearchFilters {
  regions: string[]
  lifestyle: string[]
  minPrice: number
  maxPrice: number
  types: string[]
  amenities: string[]
  rating: string | null
}

export interface SortOption {
  value: string
  label: string
}

export interface SearchParams {
  filters: SearchFilters
  sort: string
  page: number
}

// 필터 옵션 타입
export interface FilterOption {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface RegionOption extends FilterOption {
  accommodationCount?: number
}

export interface AccommodationTypeOption extends FilterOption {
  icon: React.ComponentType<{ className?: string }>
}

export interface AmenityOption extends FilterOption {}

export interface RatingOption {
  value: string
  label: string
  minRating: number
}

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

// 숙소 데이터 (통합)
export interface SearchAccommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  images?: string[]
  tags?: string[]
  badges?: BadgeType[]
  isSoldOut?: boolean
  bentoSize?: BentoSize
  lifestyle?: string[]
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

// 기본 필터 값
export const DEFAULT_FILTERS: SearchFilters = {
  regions: [],
  lifestyle: [],
  minPrice: 0,
  maxPrice: 1000000,
  types: [],
  amenities: [],
  rating: null,
}

export const DEFAULT_SORT = "recommend"

// 가격 범위 상수
export const PRICE_RANGE = {
  min: 0,
  max: 1000000,
  step: 10000,
} as const
