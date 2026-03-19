"use client"

import { Container } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { SearchHeroSection } from "./SearchHeroSection"
import { LifestyleFilterChips } from "./LifestyleFilterChips"
import { SearchInfoBar } from "./SearchInfoBar"
import { BentoSearchResultGrid } from "./BentoSearchResultGrid"
import { LocalCurationSection } from "./LocalCurationSection"
import { ActiveFilters } from "./ActiveFilters"
import { FilterSidebar } from "./FilterSidebar"
import { FilterBottomSheet } from "./FilterBottomSheet"
import { useSearchFilters } from "../hooks"
import { featuredSearchData, searchResultsData, totalSearchResults } from "../data/mock"
import { getRegionImage } from "../data/regionImages"
import type { SearchAccommodation } from "../types"

export function SearchPageLayout() {
  const {
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
  } = useSearchFilters()

  const regionData = getRegionImage(selectedRegion || undefined)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <SearchHeroSection region={selectedRegion || undefined} />

      {/* Main Content */}
      <Container size="wide" padding="responsive">
        {/* Lifestyle Filter Chips */}
        <div className="py-6 md:py-8">
          <LifestyleFilterChips
            selectedFilters={filters.lifestyle}
            onToggle={toggleLifestyle}
          />
        </div>

        {/* Search Info Bar */}
        <SearchInfoBar
          totalCount={totalSearchResults}
          regionLabel={selectedRegion ? regionData.label : undefined}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Mobile Filter BottomSheet */}
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

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6 lg:gap-8 pt-6">
          {/* Filter Sidebar - Desktop */}
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

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemove={removeFilter}
              onReset={resetFilters}
            />

            {/* 기획전 Section */}
            <section className="pb-8 md:pb-12">
              <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
                    기획전
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    특별히 엄선한 프리미엄 숙소를 만나보세요
                  </p>
                </div>
              </div>
              <BentoSearchResultGrid accommodations={featuredSearchData} />
            </section>

            {/* 추천 숙소 Section */}
            <section className="py-8 md:py-12 border-t border-border">
              <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
                    추천 숙소
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    조건에 맞는 숙소를 추천해 드려요
                  </p>
                </div>
              </div>
              <AccommodationGrid accommodations={searchResultsData} />
            </section>

            {/* Local Curation Section */}
            <div className="border-t border-border">
              <LocalCurationSection region={selectedRegion || undefined} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function AccommodationGrid({ accommodations }: { accommodations: SearchAccommodation[] }) {
  if (accommodations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">검색 결과가 없습니다</p>
        <p className="mt-2 text-sm text-muted-foreground">
          다른 검색 조건으로 다시 시도해 보세요
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          priority={index < 4}
        />
      ))}
    </div>
  )
}
