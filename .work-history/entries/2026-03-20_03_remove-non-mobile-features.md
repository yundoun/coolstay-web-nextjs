# 모바일 앱에 없는 기능 전체 제거

- **날짜**: 2026-03-20
- **작업 유형**: refactor
- **영향 범위**: src/domains/search/, src/components/badges/, src/components/layout/, src/app/layout.tsx

## 변경 사항

### 삭제된 컴포넌트 (19개)
- LifestyleFilterChips, SearchHeroSection, BentoAccommodationCard, BentoSearchResultGrid
- LocalCurationSection, FilterSidebar, FilterBottomSheet, ActiveFilters
- FilterSection, RegionFilter, PriceRangeFilter, AccommodationTypeFilter
- AmenityFilter, RatingFilter, SearchResultHeader, SearchResultGrid
- EcoBadge, PremiumBadge, LocalPickBadge, NewBadge (badges/ 디렉토리 전체)

### 삭제된 데이터 파일
- lifestyleFilters.ts, regionImages.ts, localCuration.ts

### 타입 간소화
- `SearchFilters`: lifestyle, types, amenities, minPrice, maxPrice, rating 필드 전부 제거 → `regions`만 남김
- Bento, Badge, Lifestyle, RegionImage, LocalCuration 관련 타입 전부 제거

### Hook 간소화
- `useSearchFilters`: toggleLifestyle, toggleType, toggleAmenity, setPriceRange, setRating, removeFilter 전부 제거
- 지역(toggleRegion)과 정렬(setSort)만 남김

### 검색 페이지 최종 구성 (모바일 앱과 동일)
1. SearchConditionBar (지역 퀵선택, 날짜, 인원)
2. PopularKeywords (검색 조건 없을 때만)
3. SearchInfoBar (결과 수 + 정렬)
4. 검색 결과 그리드 (AccommodationCard)

### 레이아웃 변경
- Header: 투명 모드는 홈(/)만. /search는 항상 solid
- MainContent: full-bleed도 홈(/)만
- Root layout: useSearchParams 제거로 Suspense 래핑 불필요 → 원복

## 기술적 결정
- 모바일 앱에 존재하지 않는 기능은 웹에서도 제거하여 기능 동등성 확보
- 향후 API 연동 시 모바일과 동일한 파라미터로 호출 가능한 구조
