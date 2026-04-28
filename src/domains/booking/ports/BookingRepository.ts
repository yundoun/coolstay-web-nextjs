import type {
  UserPaymentInfoResponse,
  ReservReadyRequest,
  ReservReadyResponse,
  ReservRegisterRequest,
  ReservRegisterResponse,
  BookListResponse,
  GuestBookResponse,
} from "@/lib/api/types"

export interface BookingListParams {
  search_type?: string
  search_extra?: string
  reserve_type?: string
  count?: number
  cursor?: string
}

/**
 * 예약 도메인 Repository 포트
 *
 * 예약 관련 데이터 접근을 추상화.
 * API 구현체 외에 mock, 테스트 등으로 교체 가능.
 */
export interface BookingRepository {
  getPaymentInfo(phoneNumber: string): Promise<UserPaymentInfoResponse>
  prepare(body: ReservReadyRequest): Promise<ReservReadyResponse>
  confirm(body: ReservRegisterRequest): Promise<ReservRegisterResponse>
  getList(params?: BookingListParams): Promise<BookListResponse>
  getUpcoming(): Promise<BookListResponse>
  getGuestBooking(bookId: string, phoneNumber: string): Promise<GuestBookResponse>
  cancel(bookId: string): Promise<void>
  hide(bookId?: string, flag?: "I" | "A"): Promise<void>
  getReceiptUrl(bookId: string): Promise<string>
}
