"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RegionFilter } from "./RegionFilter"
import { PriceRangeFilter } from "./PriceRangeFilter"
import { AccommodationTypeFilter } from "./AccommodationTypeFilter"
import { AmenityFilter } from "./AmenityFilter"
import { RatingFilter } from "./RatingFilter"
import type { SearchFilters } from "../types"

interface FilterBottomSheetProps {
  filters: SearchFilters
  onToggleRegion: (region: string) => void
  onToggleType: (type: string) => void
  onToggleAmenity: (amenity: string) => void
  onPriceChange: (minPrice: number, maxPrice: number) => void
  onRatingChange: (rating: string | null) => void
  onReset: () => void
  activeFilterCount: number
}

export function FilterBottomSheet({
  filters,
  onToggleRegion,
  onToggleType,
  onToggleAmenity,
  onPriceChange,
  onRatingChange,
  onReset,
  activeFilterCount,
}: FilterBottomSheetProps) {
  return (
    <div className="lg:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <SlidersHorizontal className="size-4" />
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0">
          <SheetHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle>필터</SheetTitle>
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
          </SheetHeader>

          <ScrollArea className="h-[calc(85vh-140px)] px-4">
            <div className="space-y-2 pb-4">
              {/* Region Filter */}
              <RegionFilter
                selectedRegions={filters.regions}
                onToggle={onToggleRegion}
              />

              <Separator />

              {/* Price Range Filter */}
              <PriceRangeFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onChange={onPriceChange}
              />

              <Separator />

              {/* Accommodation Type Filter */}
              <AccommodationTypeFilter
                selectedTypes={filters.types}
                onToggle={onToggleType}
              />

              <Separator />

              {/* Amenity Filter */}
              <AmenityFilter
                selectedAmenities={filters.amenities}
                onToggle={onToggleAmenity}
              />

              <Separator />

              {/* Rating Filter */}
              <RatingFilter
                selectedRating={filters.rating}
                onChange={onRatingChange}
              />
            </div>
          </ScrollArea>

          <SheetFooter className="border-t px-4 py-3">
            <SheetClose asChild>
              <Button className="w-full">
                결과 보기
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
