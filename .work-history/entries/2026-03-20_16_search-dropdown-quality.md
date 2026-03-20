# CompactSearchBar 코드 퀄리티 개선

- **날짜**: 2026-03-20 11:40
- **작업 유형**: refactor
- **영향 범위**: src/components/layout/Header/CompactSearchBar.tsx

## 변경 내용

### 미사용 코드 제거
- `TrendingUp` import 제거 (미사용)
- `useMemo` import 제거 (소규모 배열 필터링에 불필요)

### 효율성 개선
- position useEffect 의존성에서 `query` 제거 → 타이핑마다 getBoundingClientRect() 호출 방지
- suggest 함수 내 `.trim()` 중복 호출 제거 (이미 trimmed 값 전달)

### 가독성 개선
- 반복 `trimmed.length > 0 &&` 가드를 `showKeywords`/`showRegions`/`showAccommodations` 플래그로 정리
- 섹션 헤더 클래스 4회 반복 → `sectionHeaderCn` 상수 추출
- icon 조건분기 삼항연산자 → `ICON_MAP` 룩업 테이블로 변경
