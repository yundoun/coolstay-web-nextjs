# CoolStay Web — 프로젝트 규칙

## 작업 워크플로우

### TASKS.md 관리

- 모든 피처 브랜치에서 작업 시작 시 `TASKS.md`를 생성한다
- 태스크 ID는 자유 형식이되, 브랜치 내에서 일관된 접두사를 사용한다
  - 예: `UI-1`, `API-2`, `P1-1`, `FIX-3` 등
- 섹션 헤더(`###`)로 작업을 그룹핑할 수 있다

```markdown
# 작업명

> **진행률**: 0 / 5 (0%)

### 섹션 A
- [ ] `UI-1` 헤더 네비게이션 개선
- [ ] `UI-2` 검색 플로우 보완

### 섹션 B
- [ ] `UI-3` 예약 폼 리팩토링
```

### 태스크 진행 순서 (TDD 필수)

모든 태스크는 **TDD(Test-Driven Development)** 사이클로 진행한다.

```
1. 작업 시작 전 — 태스크 확인
   ./scripts/task-status.sh

2. 테스트 작성 (Red)
   - 태스크의 동작 명세를 테스트 케이스로 먼저 작성
   - `pnpm test:run`으로 실패 확인
   - 테스트 파일 위치: 소스 파일 옆 `__tests__/` 디렉토리

3. 구현 (Green)
   - 테스트를 통과하는 최소한의 코드 작성
   - `pnpm test:run`으로 전체 통과 확인

4. TASKS.md 업데이트
   - 체크박스 완료 처리
   - 테스트 파일 경로 + 케이스 수 기록
   예: ✅ `src/lib/api/__tests__/client.test.ts` (11 cases)

5. 히스토리 엔트리 작성 + 커밋
   git add . && git commit -m "작업유형: 설명 [태스크ID]"
   → pre-commit: 히스토리 엔트리 확인
   → post-commit: TASKS.md 진행률 자동 업데이트
```

### 테스트 컨벤션

```
도구: Vitest + @testing-library/react (UI 컴포넌트)
설정: vitest.config.ts (globals: true, @/ alias)

파일 배치 (코로케이션):
  src/lib/api/client.ts
  src/lib/api/__tests__/client.test.ts

테스트 구조:
  describe("기능 그룹", () => {
    describe("조건/상태", () => {
      it("한글로 동작을 명세한다")
    })
  })

모킹 원칙:
  - 네트워크 경계(fetch)만 모킹, 내부 구현은 모킹하지 않음
  - jsdom 환경 필요 시: 파일 상단에 // @vitest-environment jsdom
  - 각 테스트 간 상태 격리 (beforeEach에서 초기화)

커밋 전 필수:
  - `pnpm test:run` 전체 통과 확인
```

### 커밋 메시지 컨벤션

```
<type>: <설명> [<태스크ID>]

예시:
  refactor: HeroSection 꿀딜 캐러셀 제거 [P1-1]
  feat: 예약 상세 페이지 구현 [UI-3]
  fix: 검색 필터 초기화 버그 수정 [FIX-1]
```

type: `feat`, `fix`, `refactor`, `chore`, `docs`

### 히스토리 엔트리 파일명 컨벤션

```
.work-history/entries/YYYY-MM-DD_HH-MM_<태스크ID>_<slug>.md

예시:
  2026-03-25_15-30_UI-1_header-nav-improvement.md
  2026-03-25_16-00_FIX-1_search-filter-reset.md
```

## 코드 컨벤션

### 디렉토리 구조 (도메인 기반)

```
src/
├── app/
│   ├── (public)/           # 비로그인 접근 가능 라우트
│   ├── (protected)/        # 로그인 필수 라우트 (layout.tsx 인증 가드)
│   └── layout.tsx          # 루트 레이아웃
├── components/
│   ├── layout/             # 공통 레이아웃 (Header, Footer)
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── search/             # 검색 모달
│   └── accommodation/      # 숙소 카드
└── domains/
    ├── home/               # 홈 화면
    ├── search/             # 검색
    ├── accommodation/      # 숙소 상세
    ├── booking/            # 예약
    ├── auth/               # 인증
    ├── mypage/             # 마이페이지
    └── <new-domain>/       # 신규 도메인 (coupon, mileage, review, etc.)
        ├── components/
        ├── data/           # mock 데이터
        ├── hooks/
        └── types/
```

### 신규 페이지 생성 패턴

```
1. src/domains/<domain>/types/index.ts     — 타입 정의
2. src/domains/<domain>/data/mock.ts       — mock 데이터
3. src/domains/<domain>/components/        — UI 컴포넌트
4. src/app/<route>/page.tsx                — 페이지 (컴포넌트 import만)
```

### Mock 데이터 원칙

- 현재 단계에서 모든 데이터는 mock 사용
- mock 데이터는 `src/domains/<domain>/data/mock.ts`에 정의
- API 연동 시 mock을 API 호출로 교체할 수 있도록 구조화
