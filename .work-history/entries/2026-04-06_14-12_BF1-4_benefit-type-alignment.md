# BENEFIT BF-1~4 타입 정렬 + 상수 정의

## 변경 요약

### BF-1: 타입 정렬
- CouponListResponse.remain7day_count → remain_7day_count (스펙 snake_case 일치)
- CouponListParams.sort_type 주석 업데이트

### BF-3: 상수 정의
- COUPON_SEARCH_TYPE: MY_BOX(ST601), RESERVATION(ST602), FIRST_COME(ST603)
- COUPON_SORT_TYPE: BENEFIT, RECENT, EXPIRE (V2 코드)
- COUPON_DOWNLOAD_TYPE: 6가지 타입 (STORE_DOWNLOAD, FIRST_RESERVATION, EXHIBITION, PACKAGE, COUPON_DN, NEWBIE)

### BF-4: 코드 정리
- useCouponList: 하드코딩 "ST601" → COUPON_SEARCH_TYPE.MY_BOX
- 테스트 파일 remain7day_count → remain_7day_count 수정

## 테스트
- 132 tests passed
