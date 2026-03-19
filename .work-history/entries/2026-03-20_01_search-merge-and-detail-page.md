# 검색 페이지 통합 및 숙소 상세 페이지 구현

- **날짜**: 2026-03-19
- **작업 유형**: refactor, feature
- **영향 범위**: src/domains/search/, src/domains/search2/ (삭제), src/domains/accommodation/, src/app/search/, src/app/search2/ (삭제), src/app/accommodations/, src/components/layout/, src/components/ui/search-bar.tsx

## 변경 사항

### 1. 작업 히스토리 시스템 설정
- `.work-history/` 디렉토리 구조 생성 (entries/, CHANGELOG.md, README.md)
- `pre-commit` git hook: 커밋 시 히스토리 엔트리 존재 여부 강제 체크
- `post-commit` git hook: CHANGELOG.md 자동 업데이트
- `scripts/check-work-history.sh`, `scripts/append-changelog.sh` 생성

### 2. 검색 페이지 v1 + v2 통합
- **search2 도메인 전체를 search 도메인에 병합**
  - 타입 통합: `SearchFilters`에 `lifestyle` 필드 추가, `SearchAccommodation` 통합 타입 생성
  - `useSearchFilters` 훅: URL 기반 상태관리에 lifestyle 파라미터 지원 추가
  - search2 컴포넌트 이동: SearchHeroSection, LifestyleFilterChips, BentoAccommodationCard, BentoSearchResultGrid, SearchInfoBar, LocalCurationSection
  - search2 데이터 이동: lifestyleFilters, regionImages, localCuration, mock 데이터 병합
  - `ActiveFilters` 컴포넌트: lifestyle 필터 표시 지원 추가
- **통합 SearchPageLayout 구성**
  - v2의 히어로 섹션 + 라이프스타일 칩 (비주얼)
  - v1의 URL 기반 필터 + 사이드바/바텀시트 + ActiveFilters (기능)
  - 벤토 기획전 + 일반 그리드 추천숙소 + 로컬 큐레이션
- **삭제**: `src/app/search2/`, `src/domains/search2/` 전체
- **경로 업데이트**: Header TRANSPARENT_HEADER_PATHS, MainContent FULL_BLEED_PATHS, search-bar 기본 href → 모두 `/search`
- **Header NAV_ITEMS**: 검색, 예약내역, 마이페이지로 변경

### 3. 숙소 상세 페이지 구현
- **타입 정의**: AccommodationDetail, Room, Review, AmenityItem, Policy, MotelEvent (모바일 앱 API 모델 기반)
- **Mock 데이터**: 5개 숙소 상세 데이터 (객실 4종, 리뷰 3개, 이벤트 2개 포함)
- **컴포넌트 구현**:
  - `ImageGallery`: 데스크톱 그리드(2x2 메인+4서브) + 모바일 캐러셀
  - `AccommodationInfo`: 뱃지, 태그, 위치, 평점, 체크인/아웃, 주차 정보
  - `AmenityList`: 편의시설 아이콘 그리드 (가용/불가 표시)
  - `RoomCard`: 객실 카드 (이미지, 정보, 가격, 잔여실, 예약 버튼)
  - `ReviewSection`: 평점 분포 차트 + 베스트 리뷰 목록 + 답글
  - `PolicySection`: 아코디언 형태 이용 안내
  - `EventBanner`: 진행중 이벤트 카드
  - `AccommodationDetailLayout`: 전체 레이아웃 (3컬럼 데스크톱 + 스티키 예약위젯 + 모바일 하단 CTA)
- **라우트**: `/accommodations/[id]` 동적 페이지 (메타데이터 포함)

## 기술적 결정
- **URL 기반 상태관리 (v1) 선택**: v2의 useState 대비 SEO, URL 공유, 브라우저 히스토리 지원이 우수
- **v2의 비주얼 + v1의 기능 조합**: 두 버전의 장점만 취함
- **통합 타입 `SearchAccommodation`**: v1의 `Accommodation`과 v2의 `Search2Accommodation`을 하나로 합침 (선택적 필드로 확장)
- **숙소 상세 타입은 모바일 API 모델 기반**: 향후 API 연동 시 최소한의 변경으로 마이그레이션 가능

## 다음 단계
- 인증 페이지 (로그인/회원가입) 구현
- 예약 플로우 페이지 구현
- 쿠폰/마일리지/리뷰/찜/알림/마이페이지 구현
- API 연동 (모바일 API 기반 웹 API 마이그레이션)
- 실제 데이터 모델 연결 (react-query + zustand)

## 현재 페이지 구조
```
/ (홈) - HeroSection, BentoGrid, RegionCarousel, FeaturedSection
/search - 통합 검색 (히어로 + 라이프스타일 + 벤토기획전 + 일반그리드 + 로컬큐레이션)
/accommodations/[id] - 숙소 상세 (이미지갤러리 + 정보 + 편의시설 + 이벤트 + 객실 + 리뷰 + 정책)
```
