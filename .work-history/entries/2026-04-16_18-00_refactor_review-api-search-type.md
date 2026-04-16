# 리뷰 시스템 API 연동 및 검색 업태 상태 관리 개선

## 변경 사항

### 리뷰 search_type 코드 수정
- SSoT 문서에 SR001/SR002/SR003으로 잘못 기재되어 있던 리뷰 검색 타입을
  서버 V1ConstCode.java 기준 ST301/ST302/ST303으로 수정
- domain-analysis SSoT 문서 7개 파일 일괄 수정

### 숙소 리뷰 페이지 재구성 (AccommodationReviewsPage)
- useStoreDetail에서 리뷰 추출 → useStoreReviews 전용 API로 전환
- useInfiniteQuery 기반 커서 페이지네이션 ("더보기" 버튼)
- mapApiReviewToDisplay 매퍼 유틸 신규 생성

### 나의 리뷰 페이지 수정 (MyReviewsPage)
- 삭제: /reviews/delete(빈 구현) → /reviews/status/update(status=D)
- 작성: mock alert → useRegisterReview 뮤테이션 연동
- 수정: useUpdateReview 뮤테이션 연동 (기존 리뷰 데이터 전달)
- 삭제 확인 AlertDialog 추가
- 이미지 업로드: GCS 미구현으로 비활성 표시

### 검색 페이지 업태 상태 관리
- SearchConditionBar에 businessType prop 추가
- 모바일: openWithBusinessType()로 업태별 지역 목록 표시
- PC RegionDropdown: 업태별 category_code로 지역 필터링
- 하위 지역 없는 업태(게하/한옥) 도시 클릭 시 바로 검색 처리

## 수정 파일
- src/domains/review/api/reviewApi.ts
- src/domains/review/hooks/useReviewData.ts
- src/domains/review/hooks/useMyReviews.ts
- src/domains/review/utils/mapReviewToDisplay.ts (신규)
- src/domains/review/components/MyReviewsPage.tsx
- src/domains/accommodation/components/AccommodationReviewsPage.tsx
- src/domains/search/components/SearchConditionBar.tsx
- src/domains/search/components/SearchPageLayout.tsx
