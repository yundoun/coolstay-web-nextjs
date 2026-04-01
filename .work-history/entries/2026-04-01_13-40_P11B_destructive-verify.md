# Phase 11-B 추가 — 파괴적 API 검증 완료

## 추가 호출 결과
- GET /reserv/users/list (reserve_type=ALL, search_type=ST101) → books[] 20개 필드 확인
- POST /reserv/ready → 파라미터 에러 (item_key 형식 확인 필요)
- GET /reserv/guest/list → 빈 결과 (정상)
- POST /reserv/users/delete → 성공 (orderKeys 반환)
- GET /contents/reviews/list (ST301 내 리뷰) → 에러 (권한 문제 추정)

## 수정 내용
- BookRefundPolicyItem: refund_rate → percent + amount
- reservation.md: BookItem 실제 응답 JSON + 필드 테이블 업데이트
  - camelCase → snake_case 전면 수정
  - status 코드값(BS002), payment.status 코드값(PS003) 명시
  - 타임스탬프 초 단위 명시
