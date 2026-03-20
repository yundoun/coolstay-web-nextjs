# 헤더 검색창 드롭다운 자동완성 구현

- **날짜**: 2026-03-20
- **작업 유형**: feature
- **영향 범위**: src/components/layout/Header/CompactSearchBar.tsx, src/styles/globals.css

## 변경 사항
- 헤더 CompactSearchBar를 실제 입력 가능한 텍스트 필드로 변경
- 타이핑 시 드롭다운에 자동완성 결과 표시 (야놀자 스타일 참고)
  - 상단: 키워드 제안 (🔍 아이콘 + 텍스트)
  - 하단: 숙소 제안 (썸네일 + 이름 + 유형/지역)
- 포커스 시 border-primary + ring + shadow 강화
- X 버튼으로 입력 초기화 (포커스 유지)
- Enter 키로 /search?keyword= 이동
- 숙소 클릭 시 /accommodations/[id] 직행
- ESC로 드롭다운 닫기 + blur
- 외부 클릭으로 드롭다운 닫기
- animate-fade-in-down 유틸리티 추가 (0.2s 빠른 등장)

## UX 분기
- **히어로 검색바** 클릭 → 모달 (전체 검색 경험, 최근/인기 포함)
- **헤더 검색창** 타이핑 → 드롭다운 (즉시 자동완성, 빠른 접근)
