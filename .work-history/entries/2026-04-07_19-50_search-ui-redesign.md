# 검색 UI 재설계 + 모바일 검색바 활성화 + 토큰 에러 처리

> 작업일: 2026-04-07

## 변경 사항

### 1. 검색 페이지 업태 필터
- 해시태그(인기 키워드) 섹션 제거 → 업태 필터 탭 UI로 교체
- `BusinessTypeFilter` 컴포넌트 생성 (전체/모텔/호텔/리조트/펜션/캠핑 등 12종)
- URL `type` param → API `businessType` 파라미터 연결 (filter/keyword/myArea 3개 엔드포인트)
- `searchParams.ts` 유틸 추출: 검색 상태 전환 순수 함수 (buildRegionChangeParams, buildHashtagToggleParams 등)

### 2. 검색 조건바 keyword/region 분리
- 기존: `selectedRegion`에 keyword와 region을 혼합
- 변경: keyword/region 별도 prop으로 분리, 각각 다른 아이콘과 표시 방식
- KeywordSearchSection: useState → URL params를 source of truth로 변경

### 3. 모바일 헤더 검색바 활성화
- `CompactSearchBar` 모바일 onFocus: `blur() + openModal("region")` 제거
- 모바일에서도 데스크톱과 동일한 자동완성 드롭다운 (검색어/지역/숙소 3섹션)

### 4. 홈 헤더 검색바 상시 노출
- `Header.tsx`에서 HeroSection IntersectionObserver 기반 숨김 해제
- HeroSection 검색바는 그대로 유지 (날짜/인원 조건 설정 역할)

### 5. API 토큰 에러 처리 개선
- 로그인 토큰 만료(40000003/04) 시: 로그아웃 → 임시 토큰 재발급 → 재시도
- `refreshPromise`로 동시 요청 직렬화 (임시 토큰 1번만 발급)
- `isUserToken` 플래그로 로그인/임시 토큰 구분
- `setAuthErrorHandler` 콜백으로 auth store 연동

### 6. Terms 페이지 중복 key 수정
- `useTerms` 훅에서 API 응답의 중복 `code` 필터링

## 테스트
- ✅ `searchParams.test.ts` 29 cases
- ✅ `client.test.ts` 11 cases
- ✅ `auth-persist.test.ts` 통과
- ✅ Playwright E2E: 키워드↔지역 전환 8시나리오, 업태 필터, 모바일 자동완성
