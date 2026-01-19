"use client"

import { Container } from "@/components/layout"
import { FilterSidebar } from "./FilterSidebar"
import { FilterBottomSheet } from "./FilterBottomSheet"
import { SearchResultHeader } from "./SearchResultHeader"
import { ActiveFilters } from "./ActiveFilters"
import { SearchResultGrid } from "./SearchResultGrid"
import { useSearchFilters } from "../hooks"
import { searchResultsData, totalSearchResults } from "../data/mock"

export function SearchPageLayout() {
  const {
    filters,
    sort,
    toggleRegion,
    toggleType,
    toggleAmenity,
    setPriceRange,
    setRating,
    setSort,
    resetFilters,
    removeFilter,
    activeFilterCount,
  } = useSearchFilters()

  return (
    <Container size="wide" padding="responsive">
      <div className="flex gap-8 py-8">
        {/* Desktop Sidebar */}
        <FilterSidebar
          filters={filters}
          onToggleRegion={toggleRegion}
          onToggleType={toggleType}
          onToggleAmenity={toggleAmenity}
          onPriceChange={setPriceRange}
          onRatingChange={setRating}
          onReset={resetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <FilterBottomSheet
            filters={filters}
            onToggleRegion={toggleRegion}
            onToggleType={toggleType}
            onToggleAmenity={toggleAmenity}
            onPriceChange={setPriceRange}
            onRatingChange={setRating}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Result Header */}
          <SearchResultHeader
            totalCount={totalSearchResults}
            sort={sort}
            onSortChange={setSort}
          />

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onRemove={removeFilter}
            onReset={resetFilters}
          />

          {/* Results Grid */}
          <SearchResultGrid accommodations={searchResultsData} />
        </main>
      </div>
    </Container>
  )
}
