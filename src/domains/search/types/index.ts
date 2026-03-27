// 검색 필터 타입 (모바일 앱 기반: 지역 + 정렬만)
export interface SearchFilters {
  regions: string[]
}

export interface SortOption {
  value: string
  label: string
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

// 숙소 데이터 (Accommodation과 동일 구조)
export type { Accommodation as SearchAccommodation } from "@/components/accommodation"

// 기본 필터 값
export const DEFAULT_FILTERS: SearchFilters = {
  regions: [],
}

export const DEFAULT_SORT = "recommend"
