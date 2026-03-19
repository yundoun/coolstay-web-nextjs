"use client"

import { useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { DEFAULT_FILTERS, DEFAULT_SORT, PRICE_RANGE, type SearchFilters } from "../types"

export function useSearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // URL에서 필터 상태 파싱
  const filters: SearchFilters = useMemo(() => {
    if (!searchParams) {
      return DEFAULT_FILTERS
    }

    const regions = searchParams.getAll("region")
    const lifestyle = searchParams.getAll("lifestyle")
    const types = searchParams.getAll("type")
    const amenities = searchParams.getAll("amenity")
    const minPrice = Number(searchParams.get("minPrice")) || PRICE_RANGE.min
    const maxPrice = Number(searchParams.get("maxPrice")) || PRICE_RANGE.max
    const rating = searchParams.get("rating")

    return {
      regions,
      lifestyle,
      types,
      amenities,
      minPrice,
      maxPrice,
      rating,
    }
  }, [searchParams])

  // URL에서 정렬 상태 파싱
  const sort = useMemo(() => {
    return searchParams?.get("sort") || DEFAULT_SORT
  }, [searchParams])

  // 현재 선택된 지역 (첫 번째)
  const selectedRegion = filters.regions[0] || null

  // URL 업데이트 헬퍼
  const updateURL = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "")

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key)

        if (value === null) {
          return
        }

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      })

      router.push(`${pathname ?? "/search"}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  // 지역 필터 토글
  const toggleRegion = useCallback(
    (region: string) => {
      const newRegions = filters.regions.includes(region)
        ? filters.regions.filter((r) => r !== region)
        : [...filters.regions, region]
      updateURL({ region: newRegions.length > 0 ? newRegions : null })
    },
    [filters.regions, updateURL]
  )

  // 라이프스타일 필터 토글
  const toggleLifestyle = useCallback(
    (value: string) => {
      const newLifestyle = filters.lifestyle.includes(value)
        ? filters.lifestyle.filter((l) => l !== value)
        : [...filters.lifestyle, value]
      updateURL({ lifestyle: newLifestyle.length > 0 ? newLifestyle : null })
    },
    [filters.lifestyle, updateURL]
  )

  // 숙소 유형 필터 토글
  const toggleType = useCallback(
    (type: string) => {
      const newTypes = filters.types.includes(type)
        ? filters.types.filter((t) => t !== type)
        : [...filters.types, type]
      updateURL({ type: newTypes.length > 0 ? newTypes : null })
    },
    [filters.types, updateURL]
  )

  // 편의시설 필터 토글
  const toggleAmenity = useCallback(
    (amenity: string) => {
      const newAmenities = filters.amenities.includes(amenity)
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity]
      updateURL({ amenity: newAmenities.length > 0 ? newAmenities : null })
    },
    [filters.amenities, updateURL]
  )

  // 가격 범위 설정
  const setPriceRange = useCallback(
    (minPrice: number, maxPrice: number) => {
      const updates: Record<string, string | null> = {}

      if (minPrice !== PRICE_RANGE.min) {
        updates.minPrice = String(minPrice)
      } else {
        updates.minPrice = null
      }

      if (maxPrice !== PRICE_RANGE.max) {
        updates.maxPrice = String(maxPrice)
      } else {
        updates.maxPrice = null
      }

      updateURL(updates)
    },
    [updateURL]
  )

  // 평점 필터 설정
  const setRating = useCallback(
    (rating: string | null) => {
      updateURL({ rating })
    },
    [updateURL]
  )

  // 정렬 설정
  const setSort = useCallback(
    (sortValue: string) => {
      if (sortValue === DEFAULT_SORT) {
        updateURL({ sort: null })
      } else {
        updateURL({ sort: sortValue })
      }
    },
    [updateURL]
  )

  // 전체 필터 초기화
  const resetFilters = useCallback(() => {
    router.push(pathname ?? "/search", { scroll: false })
  }, [router, pathname])

  // 특정 필터 제거
  const removeFilter = useCallback(
    (filterType: string, value?: string) => {
      switch (filterType) {
        case "region":
          if (value) {
            const newRegions = filters.regions.filter((r) => r !== value)
            updateURL({ region: newRegions.length > 0 ? newRegions : null })
          }
          break
        case "lifestyle":
          if (value) {
            const newLifestyle = filters.lifestyle.filter((l) => l !== value)
            updateURL({ lifestyle: newLifestyle.length > 0 ? newLifestyle : null })
          }
          break
        case "type":
          if (value) {
            const newTypes = filters.types.filter((t) => t !== value)
            updateURL({ type: newTypes.length > 0 ? newTypes : null })
          }
          break
        case "amenity":
          if (value) {
            const newAmenities = filters.amenities.filter((a) => a !== value)
            updateURL({ amenity: newAmenities.length > 0 ? newAmenities : null })
          }
          break
        case "price":
          updateURL({ minPrice: null, maxPrice: null })
          break
        case "rating":
          updateURL({ rating: null })
          break
      }
    },
    [filters, updateURL]
  )

  // 활성 필터 개수 계산
  const activeFilterCount = useMemo(() => {
    let count = 0
    count += filters.regions.length
    count += filters.lifestyle.length
    count += filters.types.length
    count += filters.amenities.length
    if (filters.minPrice !== PRICE_RANGE.min || filters.maxPrice !== PRICE_RANGE.max) {
      count += 1
    }
    if (filters.rating) {
      count += 1
    }
    return count
  }, [filters])

  // 필터가 적용되었는지 여부
  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    sort,
    selectedRegion,
    toggleRegion,
    toggleLifestyle,
    toggleType,
    toggleAmenity,
    setPriceRange,
    setRating,
    setSort,
    resetFilters,
    removeFilter,
    activeFilterCount,
    hasActiveFilters,
  }
}
