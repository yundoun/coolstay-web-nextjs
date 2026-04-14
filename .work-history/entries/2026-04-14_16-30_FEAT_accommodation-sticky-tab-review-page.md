# 숙소 상세 스티키 탭 네비게이션 및 리뷰 전체보기 페이지

## 변경 사항

### 숙소 상세 페이지 개선
- `SectionTabNav` 스티키 탭 네비게이션 추가 (숙소소개, 후기요약, 객실선택, 혜택, 시설/서비스)
- `DateGuestPicker` 날짜/인원 선택 모달 추가
- `AccommodationDetailLayout` 섹션 구조 리팩토링
- `AccommodationInfo` 숙소 정보 표시 개선

### 리뷰 전체보기 페이지 구현
- `/accommodations/[id]/reviews` 라우트 신규 생성
- 숙소 정보 헤더 (썸네일, 이름, 주소) 표시
- 평점 분포 그래프 (API 미제공 시 리뷰 데이터에서 직접 계산)
- 최신순/평점 높은순/낮은순 정렬
- 이미지 리뷰: 상단에 메인 이미지를 크게 표시하는 카드 레이아웃

### 리뷰 데이터 매핑 수정 (`mapMotelToDetail.ts`)
- `best_rating`에 images가 없을 때 `rating.reviews[]`에서 같은 key의 이미지 보충
- `userName` 하드코딩 `""` → `r.user?.name ?? "익명"` 매핑
- `ratingDistribution` 빈 객체 → 리뷰 데이터에서 직접 계산
- 이미지 배열에서 undefined 필터링 추가

### 리뷰 카드 스타일 통일
- `ReviewCardParts.tsx` 공용 서브 컴포넌트 추출
  - `InlineStars`, `BestBadge`, `OwnerReply`, `ReviewCardContainer`
- `ReviewSection` (상세 페이지)과 `AccommodationReviewsPage` (전체보기) 모두 공용 컴포넌트 사용

## 수정 파일
- `src/components/layout/route-layout-config.ts`
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx`
- `src/domains/accommodation/components/AccommodationInfo.tsx`
- `src/domains/accommodation/components/ReviewSection.tsx`
- `src/domains/accommodation/components/ReviewCardParts.tsx` (신규)
- `src/domains/accommodation/components/AccommodationReviewsPage.tsx` (신규)
- `src/domains/accommodation/components/SectionTabNav.tsx` (신규)
- `src/domains/accommodation/components/DateGuestPicker.tsx` (신규)
- `src/domains/accommodation/utils/mapMotelToDetail.ts`
- `src/app/(public)/accommodations/[id]/reviews/` (신규)
