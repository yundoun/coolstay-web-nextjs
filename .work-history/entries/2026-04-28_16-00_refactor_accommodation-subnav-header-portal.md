# 숙소 상세 서브 네비 헤더 포탈 통합

## 작업 내용
- 숙소 상세 페이지의 서브 네비(탭 + pill 버튼)를 별도 fixed 오버레이에서 헤더 확장 슬롯(#header-extension) portal로 이전
- 검색 페이지(SearchConditionBar)와 동일한 헤더 통합 패턴 적용
- back variant 헤더에 header-extension 슬롯 추가
- 서브 네비 배경색 흰색 통일 (bg-background/95 backdrop-blur → bg-white)
- 하단 CTA 바 위치 수정: bottom-14 → bottom-0 (showBottomNav: false이므로 하단 네비 없음)

## 변경 파일
- `src/components/layout/Header/Header.tsx` — back variant에 header-extension div 추가
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx` — createPortal 적용, 배경색 변경, CTA 위치 수정
