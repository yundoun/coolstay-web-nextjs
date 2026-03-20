# 헤더 검색 pill — 홈 전용 컴팩트 검색 진입점

- **날짜**: 2026-03-20
- **작업 유형**: feature
- **영향 범위**: src/components/layout/Header/

## 변경 사항
- CompactSearchBar를 "어디로 · 날짜 · 인원" pill 형태로 재구현
  - 클릭 시 /search로 이동
  - primary 색상 돋보기 아이콘 우측 배치
- 홈(/) 페이지에서만 표시, 히어로 검색바가 스크롤 아웃(300px)된 후 페이드인
- 모바일/데스크톱 모두 표시 (flex-1 max-w-lg)
- pill 표시 시 md 네비게이션 숨김, lg부터 다시 표시 (공간 확보)
- /search, /accommodations 등 다른 페이지에서는 pill 안 나타남

## 기술적 결정
- 야놀자 스타일(상시 텍스트 필드)은 Quiet Luxury 톤과 안 맞음
- 아고다 스타일 변형: 필요할 때만 자연스럽게 나타나는 pill
- 홈에서만 동작하는 이유: 다른 페이지에는 각자의 검색/조건 UI가 있음
