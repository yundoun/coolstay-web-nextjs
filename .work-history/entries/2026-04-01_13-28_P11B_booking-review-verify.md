# Phase 11-B — 예약/리뷰 API 검증 + 타입 수정

## API 호출 결과

### 검증 완료
- GET /reserv/users/upcoming → total_count + books[]
- GET /reserv/users/payments/list → payment_methods 구조 확인
- GET /contents/reviews/list (ST302) → reviews[] 상세 구조 확인

### 주요 발견 및 수정
1. UserPaymentInfoResponse: 필드명 전체 불일치 (camelCase→snake_case), 구조 변경
2. Review.reg_dt: string→number (초 단위), user/status_info 필드 누락
3. Comment.reg_dt: string→number
4. Review.images: ImageItem→ReviewImage (간소화된 구조)
5. ReviewItem/ReviewSummary: API와 완전 단절된 Legacy 타입 삭제
6. PaymentMethodItem: 구조 전면 교체 (pg_code, available_yn, guide_message)

## 미검증 (파괴적/데이터 필요)
- POST /reserv/ready, /reserv/register (실제 예약 생성)
- POST /reserv/delete (예약 취소)
- POST /contents/reviews/register, update, delete (리뷰 CRUD)
- GET /reserv/users/list (파라미터 에러 — 추가 조사 필요)
