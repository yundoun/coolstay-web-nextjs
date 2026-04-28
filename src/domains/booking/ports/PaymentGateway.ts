export interface PaymentParams {
  orderId: string
  goodName: string
  price: number
  buyerName: string
  buyerTel: string
  buyerEmail?: string
  payMethod?: string
}

export interface PaymentFormData {
  version: string
  mid: string
  oid: string
  price: string
  timestamp: string
  signature: string
  verification: string
  mKey: string
  use_chkfake: string
  goodname: string
  buyername: string
  buyertel: string
  buyeremail: string
  gopaymethod: string
  returnUrl: string
  closeUrl: string
  currency: string
  acceptmethod: string
  nointerest: string
  quotabase: string
  merchantUid: string
}

/**
 * 결제 게이트웨이 포트
 *
 * PG 결제 처리를 추상화하여 이니시스 외 다른 PG로 교체 가능.
 */
export interface PaymentGateway {
  createFormData(params: PaymentParams): Promise<PaymentFormData>
  requestPayment(formId: string): void
}
