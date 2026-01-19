// 검색 필터 타입 정의
export interface SearchFilters {
  regions: string[]
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

// 기본 필터 값
export const DEFAULT_FILTERS: SearchFilters = {
  regions: [],
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
