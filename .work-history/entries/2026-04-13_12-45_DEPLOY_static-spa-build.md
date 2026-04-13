# 정적 빌드(SPA) 배포 지원

## 작업 요약
dev 서버(pineone-dev01)에 정적 빌드로 배포할 수 있도록 Next.js 설정 및 라우팅 구조 변경

## 변경 사항

### next.config.ts
- `BUILD_MODE=export` 환경변수로 정적 빌드 모드 전환
- `output: 'export'`, `basePath: '/web/coolstay'`, `trailingSlash: true`, `images.unoptimized` 설정

### 동적 라우트 SPA 대응
- 6개 동적 라우트를 서버/클라이언트 컴포넌트로 분리
- `generateStaticParams`에 플레이스홀더 ID 반환
- 클라이언트에서 `usePathname`으로 실제 URL의 ID를 파싱하여 API 호출

### 레이아웃 Suspense 추가
- 루트 레이아웃: Header, SearchModal에 Suspense 경계 추가
- protected 레이아웃: 서버 컴포넌트 + guard.tsx (클라이언트) 분리

### 기타
- 로고 경로에 `NEXT_PUBLIC_BASE_PATH` 환경변수 적용
- design-system 페이지: getServerSideProps → getStaticProps
- serve.js: 동적 라우트 템플릿 매핑 + SPA fallback Node.js 서버

## 빌드 명령
```bash
BUILD_MODE=export NEXT_PUBLIC_API_BASE_URL=/web/coolstay/api/v2/mobile NEXT_PUBLIC_BASE_PATH=/web/coolstay pnpm build
```

## 배포 구조
```
Apache(Docker) → ProxyPass → Node.js serve.js (3001) → 정적 파일 서빙 + SPA fallback
                → ProxyPass → API 서버 (9000)
```
