export type InquiryCategory = "예약" | "결제" | "취소/환불" | "기타"
export type InquiryStatus = "pending" | "answered"

export interface InquiryItem {
  id: string
  category: InquiryCategory
  content: string
  createdAt: string
  status: InquiryStatus
  reply?: string
  repliedAt?: string
}
