"use client"

import { Container } from "@/components/layout"
import { SearchHeroSection } from "./SearchHeroSection"
import { LifestyleFilterChips } from "./LifestyleFilterChips"
import { SearchInfoBar } from "./SearchInfoBar"
import { BentoSearchResultGrid } from "./BentoSearchResultGrid"
import { LocalCurationSection } from "./LocalCurationSection"
import { useSearch2Filters } from "../hooks"
import { search2MockData, totalSearchResults } from "../data/mock"
import { getRegionImage } from "../data/regionImages"

export function Search2PageLayout() {
  const {
    filters,
    sort,
    selectedRegion,
    toggleLifestyle,
    setSort,
    activeFilterCount,
  } = useSearch2Filters()

  const regionData = getRegionImage(selectedRegion || undefined)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <SearchHeroSection
        region={selectedRegion || undefined}
      />

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
          activeFilterCount={activeFilterCount}
        />

        {/* Bento Grid Results */}
        <div className="py-6 md:py-8">
          <BentoSearchResultGrid accommodations={search2MockData} />
        </div>

        {/* Local Curation Section */}
        <LocalCurationSection region={selectedRegion || undefined} />
      </Container>
    </div>
  )
}
