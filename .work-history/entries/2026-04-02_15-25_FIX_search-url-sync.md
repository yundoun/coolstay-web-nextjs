# fix: 검색 페이지 URL 동기화 및 이미지/카운트 오류 수정

## 작업 내용

### 1. 검색 조건 URL 동기화
- SearchPageLayout에서 checkIn/checkOut/adults/kids를 URL params에서 읽도록 변경
- 기존: 로컬 state 기본값(오늘/내일) 사용 → URL과 검색바 불일치
- 수정: URL을 single source of truth로 사용

### 2. API 이중 호출 제거
- 원인: regionCode가 zustand store에 잔존하여 keyword 검색과 filter 검색이 동시 발동
- 수정: regionCode를 URL param으로 전달 (store fallback 제거)
- HeroSection, SearchModal(GuestPanel), SearchConditionBar 모두 통일

### 3. AccommodationCard 빈 이미지 처리
- imageUrl이 빈 문자열일 때 Next.js Image src="" 에러 발생
- 조건부 렌더링으로 "이미지 없음" placeholder 표시

### 4. total_count 음수 처리
- API 응답의 total_count가 -1일 때 "검색결과 -1개" 표시 방지
- Math.max(total_count, 0)으로 음수를 0 처리

## 수정 파일
- src/components/accommodation/AccommodationCard.tsx
- src/components/search/SearchModal.tsx
- src/domains/home/components/HeroSection.tsx
- src/domains/search/components/SearchConditionBar.tsx
- src/domains/search/components/SearchPageLayout.tsx
- src/domains/search/hooks/useContentsData.ts
- src/domains/search/hooks/useKeywordData.ts
