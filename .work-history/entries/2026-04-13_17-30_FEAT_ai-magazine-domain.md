# AI 매거진 도메인 구현

## 작업 요약
/aiMagazine/* 전용 API 연동으로 매거진 기능 전체 구현

## 변경 사항

### 신규 도메인: `src/domains/magazine/`
- `types/index.ts` — 매거진 전용 타입 (7개 API 응답 커버)
- `api/magazineApi.ts` — 7개 API 엔드포인트 (home, regions, board/list, board/detail, package/list, package/detail, package/banner)
- `hooks/useMagazine.ts` — React Query 훅 (useInfiniteQuery로 커서 페이징)
- `components/` — 11개 컴포넌트

### 라우트: `src/app/(public)/magazine/`
- `/magazine` — 매거진 홈 (배너+영상+게시글+패키지 4섹션 + 지역 필터)
- `/magazine/board` — 게시글 목록 (타입 필터: 전체/영상/칼럼/맛집후기 + 커서 페이징)
- `/magazine/board/[key]` — 게시글 상세 (HTML 본문 + 작성자 + 패키지 배너 + 추천 숙소)
- `/magazine/package` — 패키지 목록 (커서 페이징)
- `/magazine/package/[key]` — 패키지 상세 (이미지 갤러리 + 연결 숙소 + 쿠폰)

### 홈 페이지 변경
- `MagazineSection.tsx` — `/home/main`의 `ai_magazines` 대신 `/aiMagazine/home` API 직접 호출로 변경
- `page.tsx` — 매거진 섹션 조건부 렌더링 제거, "전체보기" → `/magazine` 링크 추가

## 기술 결정
- 홈 매거진 섹션: `/home/main` 엔드포인트에 `ai_magazines`가 포함되지 않는 문제 → 전용 `/aiMagazine/home` API 사용으로 해결
- 게시글/패키지 목록: `useInfiniteQuery`로 커서 기반 무한 스크롤 구현
- HTML 본문: `dangerouslySetInnerHTML` + Tailwind prose 스타일
- VIDEO 타입: 외부 URL을 새 탭으로 열기 (앱의 외부 브라우저 패턴)
