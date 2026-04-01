# Mock 정리 + 가이드 API 연동 + 정렬 옵션 통일

## 작업 내용

### 미사용 Mock 파일 삭제
- `search/data/filterOptions.ts` — import 없음, constants.ts와 중복
- `favorites/data/mock.ts` — API 전환 완료 후 잔존
- `guide/data/mock.ts` — API 연동으로 대체

### 이용가이드 API 연동
- `csApi.ts`에 `getGuideList()` 추가 (board_type=GUIDE)
- `GuidePage.tsx` → React Query로 API 호출
- 로딩/에러/빈 상태 처리, 배너 이미지/상세 이미지/웹뷰 링크 지원

### 정렬 옵션 AOS 기준 통일
- `constants.ts` 6개 → 7개로 변경
- AOS API 파라미터 값과 일치: BENEFIT, BENEFIT_STAY, RATING, STAY_PRICE_LOW, STAY_PRICE_HIGH, BENEFIT_MILEAGE, USER_LIKE
- `DEFAULT_SORT` → "BENEFIT"

### FavoritesPage mock 제거
- 삭제된 mock import 제거, 빈 배열로 초기화

### TASKS.md Phase 10 작성
- API 응답 구조 재설계 24개 태스크 (가이드/쿠폰/기획전/찜/공통)

## 변경 파일
- `src/domains/cs/api/csApi.ts`
- `src/domains/guide/components/GuidePage.tsx`
- `src/domains/favorites/components/FavoritesPage.tsx`
- `src/domains/search/data/constants.ts`
- `src/domains/search/types/index.ts`
- `TASKS.md`
- 삭제: `filterOptions.ts`, `favorites/data/mock.ts`, `guide/data/mock.ts`
