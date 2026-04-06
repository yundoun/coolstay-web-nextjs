# CONTENTS CT-1~7 + HOME HM-1~3 UI 갭 구현

## 변경 요약

### CONTENTS UI 구현 (CT-1~7)
- 목록 카드: benefit_tags(혜택태그), grade_tags(등급태그), v2_support_flag(뱃지), coupons 할인액 표시
- 상세 페이지: 객실 쿠폰(sub_items.coupons), CUR_SALES 남은 수량, keywords 매핑
- BenefitSection: 결제혜택 +α 표시, 찜 토글 상태 연동(userLikeYn)
- mapStoreToAccommodation: supportFlags 추출, sub_items 구조 대응

### HOME 타입 정렬 + UI 구현 (HM-1~3)
- HomeBanner: title, start_dt, end_dt 등 스펙 필드 추가
- RegionCategory: thumb_url, geometry, sub_regions, mapping_business_types 추가
- 배너 기간 필터링 (start_dt/end_dt 기반 노출 제어)
- 비회원 최근 본 숙소 localStorage 연동 (addRecentStoreKey/getRecentStoreKeys)
- 지역 탭 썸네일 표시 (thumb_url)
- getStayPrice sub_items 구조 대응

## 테스트
- TypeScript 컴파일 에러 없음
- 132 tests passed (기존과 동일)
