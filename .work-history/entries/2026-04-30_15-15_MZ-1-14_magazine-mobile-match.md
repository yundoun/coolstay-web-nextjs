# 매거진 페이지 모바일 앱 구조 동일화

## 작업 배경
모바일 앱(AOS) 캡쳐본과 웹 매거진 페이지의 영역 구성이 불일치.
API 응답 구조(4필드)를 그대로 UI 섹션으로 매핑한 것이 원인.
캡쳐본 기준으로 영역을 재정의하고 데이터 소스를 역추적하여 재구성.

## 변경 사항

### 매거진 전용 페이지 (MagazineHomePage)
- 캡쳐본 6개 영역 순서대로 재구성
- 배너 캐러셀: 16:9 비율, dot 인디케이터, 3초 자동 슬라이드
- 지역 필터: 헤더 옆 → 배너 아래로 이동 ("지금은 전국 ▼")
- AI 추천 관광정보 (신규): 한국관광공사 공공API 연동, 4탭(관광지/문화시설/축제/음식점)
- 인플루언서 영상 (신규): 수평 카드 + CTA 버튼 ("AI 인플루언서 영상 전체보기")
- 추천 숙소 모아보기 (신규): /aiMagazine/store/list API, 위치 기반
- 이런 글은 어떠신지: 그리드 → 수평 스크롤 + 하단 그라데이션
- 영상/패키지 섹션 제거 (캡쳐본에 없음)

### 홈 화면 매거진 섹션 (MagazineSection)
- video+board 합쳐서 표시 → magazine_banner 데이터로 변경

### 신규 파일
- TourSection.tsx — 관광공사 API 탭 + 카드 컴포넌트
- InfluencerSection.tsx — 인플루언서 수평 카드 + CTA
- RecommendStoreSection.tsx — 위치 기반 추천 숙소 카드
- api/tour/route.ts — 관광공사 API CORS 프록시 (Next.js API Route)

## 빌드 검증
- next build 성공
- Playwright E2E: 6개 섹션 모두 정상 렌더링 확인
