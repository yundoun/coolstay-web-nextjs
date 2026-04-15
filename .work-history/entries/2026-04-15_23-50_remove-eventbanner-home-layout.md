# 숙소 상세 EventBanner 제거 및 홈 레이아웃 개선

## 변경 사항

### 숙소 상세 페이지 - EventBanner 제거
- `EventBanner.tsx` 컴포넌트 파일 삭제
- `AccommodationDetailLayout.tsx`에서 EventBanner import 및 사용 코드 제거
- `components/index.ts`에서 export 제거
- 사유: 이벤트는 별도 이벤트 페이지에서 관리, 숙소 상세에 중복 표시 불필요

### 홈 화면 레이아웃 개선
- `BusinessTypeGrid`: 수평 스크롤 → 4열 그리드 레이아웃
- `PromoCards`: 수평 스크롤 → 세로 1열(모바일)/3열(데스크톱) 그리드
- `page.tsx`: 스켈레톤 높이 PromoCards와 일치하도록 조정

## 수정 파일
- `src/domains/accommodation/components/EventBanner.tsx` (삭제)
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx`
- `src/domains/accommodation/components/index.ts`
- `src/domains/home/components/BusinessTypeGrid.tsx`
- `src/domains/home/components/PromoCards.tsx`
- `src/app/(public)/page.tsx`
