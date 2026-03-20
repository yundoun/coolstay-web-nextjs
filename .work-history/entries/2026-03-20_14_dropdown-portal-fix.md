# 헤더 검색 드롭다운 렌더링 수정

- **날짜**: 2026-03-20
- **작업 유형**: bugfix
- **영향 범위**: src/components/layout/Header/CompactSearchBar.tsx

## 문제
- 헤더에서 타이핑해도 드롭다운이 안 보임
- 원인: header의 `backdrop-blur-md`가 stacking context를 생성하여 드롭다운이 헤더 영역 밖으로 넘칠 수 없음

## 수정
- `createPortal`로 드롭다운을 `document.body`에 렌더링
- `getBoundingClientRect`로 입력 필드 위치 기반 드롭다운 좌표 동적 계산
- `z-index: 60`으로 헤더(z-50) 위에 배치
- `data-search-dropdown` 속성으로 외부 클릭 감지 시 드롭다운 영역 제외
