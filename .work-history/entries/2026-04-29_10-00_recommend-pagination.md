# 추천 숙소 "새로운 추천" 버튼 페이지네이션 구현

## 변경 사항
- RegionRecommendations 컴포넌트에 4개씩 클라이언트 페이지네이션 추가 (AOS PageManager 방식)
- "새로운 추천" 버튼을 타이틀 우측으로 이동
- 지역 탭 전환 시 로딩 스켈레톤으로 레이아웃 시프트 방지

## 수정 파일
- src/domains/home/components/RegionRecommendations.tsx
- src/app/(public)/page.tsx
