# 홈 화면 API 연동

## 변경 사항
- API 클라이언트 토큰 관리 개선: access_token + secret 쌍으로 관리
- 홈 API 엔드포인트 전환: contents/filter → home/main, home/regionStores
- Home API 응답 타입 정의 (HomeMainResponse, RegionStoresResponse 등)
- 8개 홈 컴포넌트를 mock 데이터 → API props 기반으로 전환
- 데이터 없는 섹션 자동 숨김 (최근 본 숙소, 매거진)

## 확인된 API 엔드포인트
- `POST /api/v2/mobile/home/main` — 홈 화면 전체 데이터
- `POST /api/v2/mobile/home/regionStores` — 지역별 추천 숙소
- `POST /api/v2/mobile/auth/sessions/temporary` — 게스트 토큰 발급
