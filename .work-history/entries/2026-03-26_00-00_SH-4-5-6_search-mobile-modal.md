# [SH-4~6] 검색 조건 모바일 모달 분리 + PC 드롭다운 유지

## 작업 내용
- SearchConditionBar: 모바일에서 요약 바(지역·날짜·인원) 표시, 탭 시 SearchModal 열기. PC는 기존 드롭다운 유지
- CompactSearchBar: 모바일에서 input focus 시 SearchModal 열기. PC는 기존 자동완성 드롭다운 유지
- SearchModal: 모바일 full-screen sheet 스타일(하단 슬라이드), DatePanel 모바일 단일 캘린더
- SearchPageLayout: SearchConditionBar에 onSearch prop 연결, handleSearch로 URL 파라미터 갱신
- Header/MainContent: SearchFilterBar 통합 시도 롤백, 원래 구조 유지

## 변경 파일
- src/components/search/SearchModal.tsx
- src/domains/search/components/SearchConditionBar.tsx
- src/domains/search/components/CompactSearchBar.tsx
- src/domains/search/components/SearchPageLayout.tsx
- src/components/layout/Header/Header.tsx
- src/components/layout/MainContent.tsx
