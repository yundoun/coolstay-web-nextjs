# 홈 화면 글래스모피즘 디자인 통일

## 작업 내용
홈 화면의 모든 카드 컴포넌트를 글래스모피즘 스타일로 통일.

## 변경 파일
- `PromoCards.tsx` — 카드별 컬러 orb + frosted glass + 노이즈 텍스처로 전면 재설계
- `BusinessTypeGrid.tsx` — glass card + 아이콘 바운스 호버, 모바일 가로 스크롤
- `HeroSection.tsx` — 검색바 glass surface 적용
- `RecentlyViewed.tsx` — bg-card border → glass surface
- `RegionRecommendations.tsx` — bg-card border → glass surface
- `EventSection.tsx` — bg-card border → glass surface
- `MagazineSection.tsx` — bg-card border → glass surface
- `FeatureSection.tsx` — rounded-2xl 통일

## 공통 디자인 토큰
- `background: rgba(255,255,255,0.6)` + `backdrop-blur: 16px`
- `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5)`
- `rounded-2xl` 통일
- 호버: `shadow-lg` + `-translate-y-0.5` lift 효과
