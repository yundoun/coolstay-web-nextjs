"use client"

import { useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { DEFAULT_FILTERS, DEFAULT_SORT, type SearchFilters } from "../types"

export function useSearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: SearchFilters = useMemo(() => {
    if (!searchParams) return DEFAULT_FILTERS
    const regions = searchParams.getAll("region")
    return { regions }
  }, [searchParams])

  const sort = useMemo(() => {
    return searchParams?.get("sort") || DEFAULT_SORT
  }, [searchParams])

  const selectedRegion = filters.regions[0] || null

  const updateURL = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "")

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key)
        if (value === null) return
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

  const toggleRegion = useCallback(
    (region: string) => {
      const newRegions = filters.regions.includes(region)
        ? filters.regions.filter((r) => r !== region)
        : [...filters.regions, region]
      updateURL({ region: newRegions.length > 0 ? newRegions : null })
    },
    [filters.regions, updateURL]
  )

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

  const resetFilters = useCallback(() => {
    router.push(pathname ?? "/search", { scroll: false })
  }, [router, pathname])

  const activeFilterCount = filters.regions.length
  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    sort,
    selectedRegion,
    toggleRegion,
    setSort,
    resetFilters,
    activeFilterCount,
    hasActiveFilters,
  }
}
