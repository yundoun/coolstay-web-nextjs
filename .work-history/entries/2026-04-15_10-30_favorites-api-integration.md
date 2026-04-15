# 찜 기능 API 연동 및 마이페이지 폭 통일

## 변경 사항

### 마이페이지 컨테이너 폭 통일
- 예약내역, 찜, 후기, 쿠폰, 마일��지 페이지를 narrow(800px)로 통일
- 기존에 normal(1200px)이던 5개 페이지를 나머지 마이��이지 메뉴와 동일하게 조정

### 찜 토글 API 연동
- AccommodationCard: onToggleFavorite 콜백 prop 추가, 낙관적 업데이트로 즉시 UI 반영
- AccommodationInfo (숙소 상세): useFavorites 훅 연결, 찜/찜하기 토글
- SearchPageLayout: 검색 결과 카드에 찜 토글 연결
- ExhibitionDetailPage: 기획전 참여 숙소 카드에 찜 토글 연결
- deleteDibs API에 필수 파라미터 flag:"I" 누락 수정

### favorites 페이지 정리
- 최근본 탭 제거 (홈 화면과 별도 저장소 사용하여 항상 비어있던 문제)
- 편집 모드(전체선택/일괄삭제) 제거, 하트 클릭으로 개별 해제
- 페이지 타이틀 "찜 / 최근본" → "찜한 숙소"
- 마이페이지 메뉴 라벨 "최근/관심 숙소" → "찜한 숙소"

### 낙관적 업데이트 적용
- 하트 클릭 �� 로컬 상태 즉시 토글, API 실패 시 롤백
- 검색 쿼리 invalidate 제거하여 목록 새로고침 방지
- favorites, contents/detail 쿼리만 갱신

## 수정 파일
- src/components/accommodation/AccommodationCard.tsx
- src/domains/accommodation/components/AccommodationInfo.tsx
- src/domains/search/components/SearchPageLayout.tsx
- src/domains/exhibition/components/ExhibitionDetailPage.tsx
- src/domains/favorites/components/FavoritesPage.tsx
- src/domains/favorites/hooks/useFavorites.ts
- src/domains/booking/components/BookingHistoryPage.tsx
- src/domains/coupon/components/CouponListPage.tsx
- src/domains/mileage/components/MileagePage.tsx
- src/domains/review/components/MyReviewsPage.tsx
- src/domains/mypage/components/MyPage.tsx
- src/app/(protected)/favorites/page.tsx
