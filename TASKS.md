# Contents API 연동 — Phase 1: 검색/목록

> **진행률**: 8 / 8 (100%)

### API 기반 작업
- [x] `CA-1` Swagger 파라미터/응답 확인 → 타입 정의
- [x] `CA-2` contents API 함수 작성 (contentsApi.ts)
- [x] `CA-3` React Query hooks 작성

### 검색/목록 연동
- [x] `CA-4` `GET /api/v2/mobile/contents/regions/list` — 지역 필터 데이터 교체
- [x] `CA-5` `GET /api/v2/mobile/contents/list` — 숙소 목록 조회 연동
- [x] `CA-6` `GET /api/v2/mobile/contents/total/list` — 제휴점 전체 목록 연동 (Hook 준비, dev 데이터 없음)
- [x] `CA-7` `GET /api/v2/mobile/contents/filter` + `POST /api/v2/mobile/contents/filter/list` — 필터/페이징 연동 (Hook 준비, dev 데이터 없음)
- [x] `CA-8` `GET /api/v2/mobile/contents/myArea/list` — 내 주변 추천 숙소 연동 ✅ 실제 데이터 확인
