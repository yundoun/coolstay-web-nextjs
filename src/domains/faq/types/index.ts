export type FaqCategory = "예약" | "결제" | "취소/환불" | "회원" | "기타"

export interface FaqItem {
  id: string
  category: FaqCategory
  question: string
  answer: string
}
