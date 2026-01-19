"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RegionFilter } from "./RegionFilter"
import { PriceRangeFilter } from "./PriceRangeFilter"
import { AccommodationTypeFilter } from "./AccommodationTypeFilter"
import { AmenityFilter } from "./AmenityFilter"
import { RatingFilter } from "./RatingFilter"
import type { SearchFilters } from "../types"

interface FilterSidebarProps {
  filters: SearchFilters
  onToggleRegion: (region: string) => void
  onToggleType: (type: string) => void
  onToggleAmenity: (amenity: string) => void
  onPriceChange: (minPrice: number, maxPrice: number) => void
  onRatingChange: (rating: string | null) => void
  onReset: () => void
  activeFilterCount: number
}

export function FilterSidebar({
  filters,
  onToggleRegion,
  onToggleType,
  onToggleAmenity,
  onPriceChange,
  onRatingChange,
  onReset,
  activeFilterCount,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-24">
        <div className="rounded-xl border bg-card p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">필터</h2>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                onClick={onReset}
              >
                초기화
              </Button>
            )}
          </div>

          <Separator className="my-2" />

          {/* Region Filter */}
          <RegionFilter
            selectedRegions={filters.regions}
            onToggle={onToggleRegion}
          />

          <Separator className="my-2" />

          {/* Price Range Filter */}
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={onPriceChange}
          />

          <Separator className="my-2" />

          {/* Accommodation Type Filter */}
          <AccommodationTypeFilter
            selectedTypes={filters.types}
            onToggle={onToggleType}
          />

          <Separator className="my-2" />

          {/* Amenity Filter */}
          <AmenityFilter
            selectedAmenities={filters.amenities}
            onToggle={onToggleAmenity}
          />

          <Separator className="my-2" />

          {/* Rating Filter */}
          <RatingFilter
            selectedRating={filters.rating}
            onChange={onRatingChange}
          />
        </div>
      </div>
    </aside>
  )
}
