# Contents 도메인 타입 coolstay-domain-analysis 스펙 정렬

## 배경

coolstay-domain-analysis의 상세 API 스펙(nested-objects.md, flow.md, v1-v2-conversion.md)과
프론트엔드 타입 정의를 비교한 결과, 다수의 타입 불일치가 발견됨.

## 변경 사항

### 타입 수정 (src/lib/api/types.ts)

- `ItemObj` 인터페이스 신규 정의 (V1ContentItemVO.ItemObj 기준)
  - key, price, discount_price, name, category, extras, images, coupons, daily_extras, sub_items 포함
- `Motel.items`: 잘못된 benefit 구조 → `ItemObj[]`
- `Motel.coupons`: `Coupon` (단일) → `Coupon[]` (배열)
- `Motel.event`: `Banner` → `Banner[]`
- `Motel.external_events`: `Banner` → `Banner[]`
- `Motel.benefits`: 단일 객체 → 배열
- `Motel.v2_support_flag`: `is_` 접두사 필드명 반영
- `Motel.max_discount_amount`: 신규 추가
- `StoreRoomItem` 제거 → `StoreItem.items: ItemObj[]`로 통일
- `StoreItem`에 `business_type`, `coupons`, `benefit_tags`, `grade_tags`, `max_discount_amount`, `v2_support_flag` 추가

### 변환 로직 정리 (mapMotelToDetail.ts)

- `eslint-disable` + `any` 캐스팅 제거
- `ItemObj` 타입으로 정확한 타입 사용
- `Array.isArray` 방어코드 제거 (타입이 이미 배열)

### 파라미터명 통일

- `FilterParams.adultCnt/kidCnt` → `adultCount/kidsCount`
- `KeywordSearchParams.adultCnt/kidCnt` → `adultCount/kidsCount`
- hooks/components에서 불필요한 이름 변환 제거

### 리뷰 검색 타입 수정

- `ST301/ST302/ST303` (잘못된 코드) → `SR001/SR002/SR003` (스펙 정확한 코드)
- `REVIEW_SEARCH_TYPE` 상수 추가

### API 명세서 업데이트

- contents-detail.md, contents-search.md, contents-review.md

## 테스트

- `mapMotelToDetail.test.ts` 8개 케이스 신규 작성
- 전체 테스트 132 passed (기존 layout.test.tsx 5 failed는 이전부터 존재하는 별도 이슈)
- TypeScript 컴파일 에러 없음
