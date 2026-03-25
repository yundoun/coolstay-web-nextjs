# CoolStay Web — 프로젝트 규칙

## 현재 작업

- **브랜치**: `feature/android-alignment`
- **목표**: Android 앱 기능 기준으로 웹 UI 정합 (Phase 1~4, 31개 태스크)
- **기준 문서**: `CoolStay_기능분석_웹전환가이드.md`, `CoolStay_웹구현_괴리분석_액션플랜.md`
- **진행 현황**: `TASKS.md`

## 작업 워크플로우

### 태스크 진행 순서

```
1. 작업 시작 전 — 태스크 확인
   ./scripts/task-status.sh

2. 코드 작업 수행

3. 태스크 완료 처리 — 체크박스 + 히스토리 엔트리 생성
   ./scripts/complete-task.sh P1-1 "HeroSection 꿀딜 제거"

4. 히스토리 엔트리 내용 작성
   .work-history/entries/YYYY-MM-DD_HH-MM_P1-1_제목.md

5. 커밋
   git add . && git commit -m "작업유형: 설명"
   → pre-commit: 히스토리 엔트리 확인
   → post-commit: CHANGELOG 해시 반영 + TASKS.md 진행률 자동 업데이트
```

### 커밋 메시지 컨벤션

```
<type>: <설명> [<태스크ID>]

예시:
  refactor: HeroSection 꿀딜 캐러셀 제거 [P1-1]
  feat: 예약 상세 페이지 구현 [P2-1]
  feat: 쿠폰 목록 페이지 구현 [P2-3]
```

type: `feat`, `fix`, `refactor`, `chore`, `docs`

### 히스토리 엔트리 파일명 컨벤션

```
.work-history/entries/YYYY-MM-DD_HH-MM_<태스크ID>_<slug>.md

예시:
  2026-03-25_15-30_P1-1_hero-honeydeal-remove.md
  2026-03-25_16-00_P2-1_booking-detail-page.md
```

## 코드 컨벤션

### 디렉토리 구조 (도메인 기반)

```
src/
├── app/                    # Next.js App Router 페이지
├── components/
│   ├── layout/             # 공통 레이아웃 (Header, Footer, BottomNav)
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
