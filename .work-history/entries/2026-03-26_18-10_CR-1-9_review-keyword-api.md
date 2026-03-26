# Contents 리뷰/키워드 API 연동 [CR-1~9]

## 작업 내용
- 타입 정의: ReviewListResponse, ReviewRegisterRequest, ReviewUpdateRequest, KeywordListResponse 등
- reviewApi.ts: 5개 API 함수 (getReviewList, registerReview, updateReview, deleteReview, updateReviewStatus)
- useReviewData.ts: 5개 Hook (useReviewList, useRegisterReview, useUpdateReview, useDeleteReview, useUpdateReviewStatus)
- keywordApi.ts: 3개 API 함수 (getKeywordList, getKeywordSearchKeys, getKeywordSearchList)
- useKeywordData.ts: 2개 Hook (useKeywordList, useKeywordSearchKeys)
- docs/api/contents-review.md API 명세서 작성

## 변경 파일
- src/lib/api/types.ts
- src/domains/review/api/reviewApi.ts (new)
- src/domains/review/hooks/useReviewData.ts (new)
- src/domains/search/api/keywordApi.ts (new)
- src/domains/search/hooks/useKeywordData.ts (new)
- docs/api/contents-review.md (new)
- TASKS.md
