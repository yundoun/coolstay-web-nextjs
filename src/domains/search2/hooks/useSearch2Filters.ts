"use client"

import { useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import type { Search2Filters } from "../types"

const initialFilters: Search2Filters = {
  regions: [],
  lifestyle: [],
  types: [],
  amenities: [],
  minPrice: 0,
  maxPrice: 500000,
  rating: null,
}

export function useSearch2Filters() {
  const searchParams = useSearchParams()

  // URL에서 초기 지역값 가져오기
  const initialRegion = searchParams?.get("region") ?? null

  const [filters, setFilters] = useState<Search2Filters>({
    ...initialFilters,
    regions: initialRegion ? [initialRegion] : [],
  })

  const [sort, setSort] = useState("recommend")

  // 라이프스타일 필터 토글
  const toggleLifestyle = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(value)
        ? prev.lifestyle.filter((v) => v !== value)
        : [...prev.lifestyle, value],
    }))
  }, [])

  // 지역 토글
  const toggleRegion = useCallback((region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }))
  }, [])

  // 숙소 타입 토글
  const toggleType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))
  }, [])

  // 편의시설 토글
  const toggleAmenity = useCallback((amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }, [])

  // 가격 범위 설정
  const setPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }))
  }, [])

  // 평점 설정
  const setRating = useCallback((rating: string | null) => {
    setFilters((prev) => ({ ...prev, rating }))
  }, [])

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  // 특정 필터 제거
  const removeFilter = useCallback(
    (type: keyof Search2Filters, value?: string) => {
      setFilters((prev) => {
        switch (type) {
          case "regions":
            return {
              ...prev,
              regions: value
                ? prev.regions.filter((r) => r !== value)
                : [],
            }
          case "lifestyle":
            return {
              ...prev,
              lifestyle: value
                ? prev.lifestyle.filter((l) => l !== value)
                : [],
            }
          case "types":
            return {
              ...prev,
              types: value ? prev.types.filter((t) => t !== value) : [],
            }
          case "amenities":
            return {
              ...prev,
              amenities: value
                ? prev.amenities.filter((a) => a !== value)
                : [],
            }
          case "rating":
            return { ...prev, rating: null }
          default:
            return prev
        }
      })
    },
    []
  )

  // 활성 필터 개수
  const activeFilterCount = useMemo(() => {
    let count = 0
    count += filters.lifestyle.length
    count += filters.types.length
    count += filters.amenities.length
    if (filters.minPrice > 0 || filters.maxPrice < 500000) count++
    if (filters.rating) count++
    return count
  }, [filters])

  // 현재 선택된 지역
  const selectedRegion = filters.regions[0] || null

  return {
    filters,
    sort,
    selectedRegion,
    toggleLifestyle,
    toggleRegion,
    toggleType,
    toggleAmenity,
    setPriceRange,
    setRating,
    setSort,
    resetFilters,
    removeFilter,
    activeFilterCount,
  }
}
