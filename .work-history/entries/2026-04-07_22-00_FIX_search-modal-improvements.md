# refactor: 검색 모달 UX 개선 — 모바일 통합 + 파라미터 정합성

## 변경사항

### 모바일 통합 검색 모달
- 풀스크린 탭 기반 UI (지역/날짜/인원)
- 각 탭에 현재 선택값 실시간 표시
- 지역 선택 시 날짜 탭 자동 이동
- 하단 "검색하기" 버튼 항상 고정
- 데스크톱은 기존 개별 모달 유지

### 검색 파라미터 정합성
- regionName URL 파라미터 설정 → 검색 페이지 지역명 정상 표시
- ALL_XX 최상위 코드 → keyword 검색 전환 (결과 0건 버그 수정)
- keyword/regionCode 배타적 패턴 통일 (hero, modal, conditionBar)

### 기타 개선
- 데스크톱 모달 단계 분리 (지역/날짜/인원 각각 독립)
- 호선 선택 시 뒤로가기 버튼 sticky 상단 고정
- 날짜 모달 적용 버튼 하단 고정 (모바일 스크롤 이슈)
- 캘린더 오늘 날짜 primary 링 표시

## 수정 파일
- `src/components/search/SearchModal.tsx`
- `src/domains/home/components/HeroSection.tsx`
- `src/domains/search/components/SearchConditionBar.tsx`
