# RESERVATION RV-1~4 타입 정렬 + 가격 계산 수정

## 변경 요약

### RV-1: 타입 정렬
- UserPaymentInfoResponse: noshow_block_start_dt/end_dt 필드 추가
- BookPaymentSimple: cancel_dt 필드 추가

### RV-3: 가격 계산 로직 수정 (pricing-formula.md 기준)
- 정률(RATE) 쿠폰: 전체 가격 → 1일차 가격(oneDayPrice)에만 적용
- CC009 제약조건: 할인 상한선 적용 (rawCoupons에서 constraints 확인)

### RV-4: 현장결제 제약 표시
- PaymentMethodSelector: onsiteDisabled, onsiteDisabledReason props 추가
- 노쇼 제재 또는 횟수 초과 시 현장결제 버튼 비활성화 + 사유 표시

## 테스트
- 132 tests passed
