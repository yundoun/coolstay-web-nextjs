# 기획전 상세 + 검색 혜택 라벨 + 프로모 검색 수정

> **일시**: 2026-04-08 14:50
> **작업자**: Claude + yundoun

## 변경 사항

### 1. 기획전 상세 API 응답 구조 수정
- `sort_tags`가 result 최상위에 반환되는 것을 발견 → hook에서 별도 추출
- `linked_stores` (참여 숙소) 렌더링 추가 — 기존 AccommodationCard 재사용
- `v2_total_coupons` 쿠폰 다운로드 버튼 추가 (비로그인 시 /login 리다이렉트)

### 2. v2_support_flag 접두사 수정
- API 실제 응답: `unlimited_coupon`, `low_price_korea` (접두사 없음)
- 기존 코드: `is_unlimited_coupon`, `is_low_price_korea` (is_ 접두사)
- 모든 타입/매핑/테스트에서 is_ 접두사 제거

### 3. 프로모 검색 전국 대상으로 변경
- 기존: GPS 좌표 기반 → 위치 근처만 반환 (부산 숙소 등 누락)
- 수정: extraType/latitude/longitude 제거 → 전국 전체 반환

### 4. docs/api 문서 삭제 + CLAUDE.md 규칙 추가
- 실측 없이 작성된 docs/api/ 10개 파일 삭제 (혼란 방지)
- CLAUDE.md에 API 연동 3단계 규칙 추가 (domain-analysis 필수 확인)

## 근본 원인
coolstay-domain-analysis 스펙에 모두 정의되어 있었으나 확인하지 않고 구현함.
유일한 예외: v2_support_flag is_ 접두사는 스펙 자체가 틀림 (Java 필드명 vs JSON 키)
