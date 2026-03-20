# 홈 화면 풀 개편 — 모바일 앱 전체 섹션 반영

- **날짜**: 2026-03-20
- **작업 유형**: feature, refactor
- **영향 범위**: src/domains/home/, src/app/page.tsx

## 변경 사항

### 홈 화면 8개 섹션 구성 (위→아래 순서)

1. **HeroSection** — 검색바 (간소화 유지)
2. **BusinessTypeGrid** — 업태 카테고리 8종 (모텔/호텔/펜션/리조트/게하/글램핑/캠핑/한옥)
   - 이모지 아이콘 + 라벨, 4열(모바일) / 8열(데스크톱) 그리드
3. **PromoBannerCarousel** — 이벤트 배너 (기존 유지)
4. **PromoCards** — 프로모션 3종 (무제한 혜택 / 국내 최저가 / 첫예약 선물)
   - 그라데이션 배경 카드, 3열 그리드
5. **RecentlyViewed** — 최근 본 숙소 (가로 스크롤 카드)
   - 좌우 화살표, 스냅 스크롤
6. **FeatureSection** — 기획전 (이미지 오버레이 카드)
   - 첫 번째 카드 2:1 비율로 강조, 나머지 16:9
7. **RegionRecommendations** — "이런 숙소는 어떠세요?" (지역별 탭 + 그리드)
   - 서울/제주/부산 탭 전환, 4열 카드 그리드, 마일리지/할인 뱃지
8. **MagazineSection** — 매거진 (콘텐츠 카드)
   - 카테고리 뱃지 + 제목 + 설명, 3열 그리드

### 삭제된 컴포넌트
- CategoryFilters, MotelCardList (이전 단조로운 버전)

### mock 데이터 전면 교체
- BusinessType, PromoCard, RecentMotel, FeatureItem, RegionRecommendation, MagazineItem 타입 추가
- 각 섹션별 mock 데이터 생성

## 참고: 정렬 옵션 (API 연동 시 적용 예정)
꿀혜택순, 최저가보장순, 무한혜택순, 선물혜택순, 숙박혜택순, 대실혜택순, 평점높은순, 가격낮은순, 가격높은순, 마일리지적립률순, 관심등록많은순 — 총 11종 정렬 옵션이 API에서 제공될 예정

## 기술적 결정
- 모바일 앱의 단일 리스트 구조를 웹에서는 섹션별 시각적 구분으로 재구성
- muted 배경 교차 배치 (기획전, 매거진)로 시각적 리듬감 부여
- RegionRecommendations의 탭 전환은 클라이언트 state로 처리 (API 연동 시 서버 데이터로 교체)
