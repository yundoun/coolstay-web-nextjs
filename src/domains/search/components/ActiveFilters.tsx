"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { filterLabels } from "../data/filterOptions"
import { PRICE_RANGE, type SearchFilters } from "../types"

interface ActiveFiltersProps {
  filters: SearchFilters
  onRemove: (filterType: string, value?: string) => void
  onReset: () => void
}

export function ActiveFilters({ filters, onRemove, onReset }: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.regions.length > 0 ||
    filters.types.length > 0 ||
    filters.amenities.length > 0 ||
    filters.minPrice !== PRICE_RANGE.min ||
    filters.maxPrice !== PRICE_RANGE.max ||
    filters.rating !== null

  if (!hasActiveFilters) {
    return null
  }

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toLocaleString()}만원`
    }
    return `${price.toLocaleString()}원`
  }

  const hasPriceFilter =
    filters.minPrice !== PRICE_RANGE.min || filters.maxPrice !== PRICE_RANGE.max

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Region filters */}
      {filters.regions.map((region) => (
        <Badge
          key={`region-${region}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filterLabels[region] || region}
          <button
            onClick={() => onRemove("region", region)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
            <span className="sr-only">제거</span>
          </button>
        </Badge>
      ))}

      {/* Type filters */}
      {filters.types.map((type) => (
        <Badge
          key={`type-${type}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filterLabels[type] || type}
          <button
            onClick={() => onRemove("type", type)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
            <span className="sr-only">제거</span>
          </button>
        </Badge>
      ))}

      {/* Amenity filters */}
      {filters.amenities.map((amenity) => (
        <Badge
          key={`amenity-${amenity}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filterLabels[amenity] || amenity}
          <button
            onClick={() => onRemove("amenity", amenity)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
            <span className="sr-only">제거</span>
          </button>
        </Badge>
      ))}

      {/* Price filter */}
      {hasPriceFilter && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
          <button
            onClick={() => onRemove("price")}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
            <span className="sr-only">제거</span>
          </button>
        </Badge>
      )}

      {/* Rating filter */}
      {filters.rating && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {filters.rating}점 이상
          <button
            onClick={() => onRemove("rating")}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
            <span className="sr-only">제거</span>
          </button>
        </Badge>
      )}

      {/* Reset all button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={onReset}
      >
        전체 초기화
      </Button>
    </div>
  )
}
