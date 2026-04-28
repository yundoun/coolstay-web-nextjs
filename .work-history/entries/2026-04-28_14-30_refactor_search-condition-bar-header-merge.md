# SearchConditionBar 헤더 통합 및 관심사 분리

## 변경 사항

### 레이아웃: 헤더-ConditionBar 갭 제거
- SearchConditionBar를 `createPortal`로 헤더 내부 `#header-extension` 슬롯에 렌더
- 기존 sticky 방식에서 발생하던 모바일 7px 갭 완전 해소
- `Container size="narrow"` 적용으로 헤더 콘텐츠(로고~로그인)와 좌우 정렬 일치

### 관심사 분리: 807줄 → 5파일
- `condition-bar/date-utils.ts` — 날짜 유틸 함수
- `condition-bar/RegionDropdown.tsx` — 지역/지하철 선택
- `condition-bar/DateDropdown.tsx` — 캘린더 날짜 선택 + CalendarMonth
- `condition-bar/GuestDropdown.tsx` — 인원 선택
- `SearchConditionBar.tsx` — 메인 바만 (170줄)

### 기타
- MainContent 모바일 `pt-16` → `pt-14`: 전 페이지 헤더 갭 해소
- 모바일 헤더 알림 아이콘(Bell) 제거

## 변경 파일
- `src/components/layout/Header/Header.tsx`
- `src/components/layout/MainContent.tsx`
- `src/domains/search/components/SearchConditionBar.tsx`
- `src/domains/search/components/SearchPageLayout.tsx`
- `src/domains/search/components/condition-bar/` (신규 4파일)
