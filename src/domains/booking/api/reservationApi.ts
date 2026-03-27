import { api } from "@/lib/api/client"
import type {
  UserPaymentInfoResponse,
  ReservReadyRequest,
  ReservReadyResponse,
  ReservRegisterRequest,
  ReservRegisterResponse,
  BookListResponse,
  GuestBookResponse,
} from "@/lib/api/types"

// ─── 결제 정보 조회 ───
export function getUserPaymentInfo(phoneNumber: string) {
  return api.get<UserPaymentInfoResponse>("/reserv/users/payments/list", {
    phone_number: phoneNumber,
  })
}

// ─── 예약 준비 (검증 + book_id 발급) ───
export function prepareBooking(body: ReservReadyRequest) {
  return api.post<ReservReadyResponse>("/reserv/ready", body)
}

// ─── 예약 확정 (결제 완료 후) ───
export function confirmBooking(body: ReservRegisterRequest) {
  return api.post<ReservRegisterResponse>("/reserv/register", body)
}

// ─── 회원 예약 목록 조회 ───
export interface BookingListParams {
  search_type?: string     // ST101=목록, ST102=상세
  search_extra?: string    // 검색 추가 정보
  reserve_type?: string    // BEFORE | AFTER | CANCEL | ALL
  count?: number
  cursor?: string
}

export function getBookingList(params: BookingListParams = {}) {
  return api.get<BookListResponse>("/reserv/users/list", {
    search_type: params.search_type || "ST101",
    ...params,
  } as Record<string, string | number | boolean | undefined>)
}

// ─── 다가오는 예약 조회 (홈 화면) ───
export function getUpcomingBooking() {
  return api.get<BookListResponse>("/reserv/users/upcoming")
}

// ─── 비회원 예약 조회 ───
export function getGuestBooking(bookId: string, phoneNumber: string) {
  return api.get<GuestBookResponse>("/reserv/guest/list", {
    book_id: bookId,
    phone_number: phoneNumber,
  })
}

// ─── 예약 취소 ───
export function cancelBooking(bookId: string) {
  return api.post<void>("/reserv/delete", { book_id: bookId })
}

// ─── 예약 내역 삭제 (숨김) ───
export function hideBooking(bookId?: string, flag: "I" | "A" = "I") {
  return api.post<void>("/reserv/users/delete", {
    book_id: bookId,
    flag,
  })
}

// ─── 영수증 URL 조회 ───
export function getReceiptUrl(bookId: string) {
  return api.get<string>("/reserv/receipt", { identifyKey: bookId })
}
