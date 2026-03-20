# 검색 페이지 개선 - 모바일 앱 기능 기반 재구성

- **날짜**: 2026-03-20
- **작업 유형**: refactor, feature
- **영향 범위**: src/domains/search/components/, src/components/layout/Header/, src/components/layout/MainContent.tsx, src/app/layout.tsx

## 변경 사항

### 1. 모바일 앱에 없는 기능 제거
- **벤토 기획전 섹션** 제거 — 모바일에 없음, 홈 큐레이션과 중복
- **로컬 큐레이션 섹션** 제거 — 모바일에 없음, 검색 결과와 무관
- 라이프스타일 칩, 가격/편의시설 필터는 유지 (웹 UX에 적합한 트렌디 기능)

### 2. 모바일 앱 기반 기능 추가
- **SearchConditionBar**: 날짜 선택기(체크인/체크아웃), 인원 선택기(성인/아동), 지역 퀵선택 Popover
- **PopularKeywords**: 인기 검색어 10개 + 최근 검색어 (추가/삭제/전체삭제)
- **정렬 옵션 확장**: 추천순, 평점순, 가격낮은순, 가격높은순, 마일리지순, 인기순 (모바일 앱의 RATING, PRICE_LOW, PRICE_HIGH, BENEFIT_MILEAGE, USER_LIKE 매핑)

### 3. Hero 섹션 조건부 표시
- **검색 조건 없을 때** (첫 진입, `/search`): 히어로 + 인기/최근 키워드 표시
- **검색 조건 있을 때** (필터/지역 선택, `/search?region=jeju`): 히어로 숨김, 결과에 집중
- Header 투명 모드, MainContent full-bleed도 동일 조건으로 전환

### 4. 검색 결과 단일 그리드로 통합
- 기획전/추천 분리 → 단일 결과 리스트로 통합
- 하단에 무한스크롤 힌트 텍스트 (향후 커서 페이지네이션 연동 대비)

### 5. 기술적 변경
- Header, MainContent에서 `useSearchParams()` 사용 → root layout에 `<Suspense>` 래핑 추가
- Header: `ALWAYS_TRANSPARENT_PATHS`와 `CONDITIONAL_TRANSPARENT_PATHS` 분리

## 기술적 결정
- **Hero 조건부 표시**: 모바일 앱에는 히어로가 없으나, 웹에서는 첫 진입 시 탐색/영감 제공 목적으로 유지. 실제 검색 시에는 결과에 집중하도록 숨김
- **정렬 옵션은 모바일 앱 기반**: 리뷰 많은순 제거 → 마일리지순, 인기순 추가
- **날짜/인원은 로컬 state**: 향후 URL 파라미터로 이관 가능하도록 설계

## 다음 단계
- 날짜 선택기를 실제 캘린더 컴포넌트로 교체 (react-day-picker)
- 키워드 검색 API 연동
- 무한 스크롤 구현 (Intersection Observer)
- 숙소 카드에 마일리지 적립률 표시
