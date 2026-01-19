# Coolstay Web

숙박 예약 플랫폼 웹 클라이언트

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (Pages Router, SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Server State | TanStack Query |
| Client State | Zustand |
| Font | Pretendard |

## 아키텍처

**Domain-based Architecture** - 비즈니스 도메인 중심 구조

```
src/
├── components/
│   ├── ui/              # 공통 UI 컴포넌트 (shadcn/ui)
│   └── layout/          # 레이아웃 컴포넌트
│
├── domains/             # 도메인별 모듈
│   ├── accommodation/   # 숙소
│   ├── booking/         # 예약
│   ├── review/          # 리뷰
│   ├── search/          # 검색
│   └── user/            # 사용자
│
├── hooks/               # 공통 훅
├── lib/                 # 유틸리티
├── stores/              # 전역 상태 (Zustand)
├── styles/              # 글로벌 스타일
└── types/               # 공통 타입
```

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)
