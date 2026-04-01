# Phase 11-A — 홈/검색/숙소 API 검증 + 기획전 신규

## API 호출 결과 요약

### 검증 완료 (10개)
- POST /home/main → 9개 필드 (banners, exhibitions, item_buttons 등)
- POST /home/regionStores → recommend_categories + recommend_stores
- GET /contents/regions/list → 17개 지역
- GET /contents/total/list → total_count + search_results[]
- GET /contents/details/list → motel 37개 필드
- GET /contents/images/list → images_per_category[]
- GET /contents/books/daystatus/list → daily_books[]
- GET /aiMagazine/board/list → 칼럼/매거진 (기획전 아님!)
- GET /aiMagazine/board/detail → board_detail 구조

### 추가 조사 필요 (4개)
- GET /contents/list → 빈 결과 (search_type/파라미터 조합 필요)
- GET /contents/filter → 에러 (파라미터 구조 상이)
- POST /contents/filter/list → 미호출
- GET /contents/refund-policy/list → 에러

### 핵심 발견
1. **기획전은 별도 API가 아닌 홈 API(exhibitions[])로 반환**
2. 기획전 상세는 board_type=EVENT&board_item_key로 조회 (type="EXHIBITION")
3. aiMagazine API는 칼럼/매거진 콘텐츠 (기획전과 무관)
4. 숙소 상세 motel 객체에 37개 필드 존재

## 코드 변경
- docs/api/home.md 전면 업데이트
- docs/api/contents-detail.md, contents-search.md 실제 응답 반영
- exhibition 도메인 신규 생성 (api, hooks, components, routes)
- /exhibitions, /exhibitions/[id] 라우트 생성
- BoardItem 타입에 banner_image_url, sort_tags 추가
