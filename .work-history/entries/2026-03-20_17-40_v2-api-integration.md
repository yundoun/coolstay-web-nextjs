# CoolStay V2 API 연동 — 홈 화면

## 작업 내용
- AOS 앱(~/Desktop/workspace/aos) 분석하여 기존 모바일 서비스 API 파악
- V2 API(dev.server.coolstay.co.kr:9000) 기반으로 웹 홈 화면 API 연동
- API 클라이언트 구현: 자동 임시 토큰 발급, 만료 시 재발급, 동시 요청 race condition 방지
- Next.js rewrites 프록시로 CORS 우회
- 홈 화면 4개 컴포넌트 API 연동 (실패 시 mock 폴백)
- contents/filter API는 dev 서버 500 에러로 mock 폴백 상태

## 변경 파일
- next.config.ts (프록시 rewrites 추가)
- src/app/layout.tsx (QueryClientProvider 추가)
- src/app/providers.tsx (신규)
- src/lib/api/client.ts (신규 — API 클라이언트)
- src/lib/api/types.ts (신규 — V2 타입 정의)
- src/domains/home/api/homeApi.ts (신규 — 홈 API 함수)
- src/domains/home/hooks/useHomeData.ts (신규 — React Query 훅)
- src/domains/home/components/PromoBannerCarousel.tsx
- src/domains/home/components/FeatureSection.tsx
- src/domains/home/components/RegionRecommendations.tsx
- src/domains/home/components/PromoCards.tsx
