# 검색 모달 3단계 스텝 방식 재설계

## 작업 내용
- 기존 단일 SearchModal을 지역→날짜→인원 3단계 모달로 전면 교체
- 지역 선택: 시/도 탭 + 세부 지역 2단 레이아웃 (10개 시/도, 각 하위 지역)
- 날짜 선택: 듀얼 캘린더 (2개월 나란히), 체크인/아웃 + N박 뱃지
- 인원 선택: 성인/아동 카운터 (만 13세 기준), 적용하기 버튼
- 홈 히어로 검색바에 선택값 실시간 반영, 검색 버튼 클릭 시 이동
- 검색 페이지에서는 모달 대신 드롭다운 방식으로 즉시 열림
- 검색 결과 그리드 xl:4열 지원
- 모달 애니메이션 0.6s→0.15s로 개선

## 변경 파일
- src/lib/stores/search-modal.ts — step 기반 상태 + 검색 조건 저장
- src/domains/search/data/regions.ts — 시/도별 세부 지역 데이터 (신규)
- src/components/search/SearchModal.tsx — 3개 패널 모달
- src/domains/home/components/HeroSection.tsx — 선택값 표시 + 검색 버튼
- src/domains/search/components/SearchConditionBar.tsx — 드롭다운 방식
- src/domains/search/components/SearchPageLayout.tsx — 4열 그리드
- src/styles/globals.css — 애니메이션 속도
