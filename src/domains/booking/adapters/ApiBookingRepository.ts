import type { HttpClient } from "@/lib/ports/HttpClient"
import type {
  BookingRepository,
  BookingListParams,
} from "../ports/BookingRepository"
import type {
  UserPaymentInfoResponse,
  ReservReadyRequest,
  ReservReadyResponse,
  ReservRegisterRequest,
  ReservRegisterResponse,
  BookListResponse,
  GuestBookResponse,
} from "@/lib/api/types"

/**
 * API 기반 BookingRepository 구현체
 *
 * HttpClient를 주입받아 예약 관련 API를 호출한다.
 */
export class ApiBookingRepository implements BookingRepository {
  constructor(private http: HttpClient) {}

  getPaymentInfo(phoneNumber: string) {
    return this.http.get<UserPaymentInfoResponse>("/reserv/users/payments/list", {
      phone_number: phoneNumber,
    })
  }

  prepare(body: ReservReadyRequest) {
    return this.http.post<ReservReadyResponse>("/reserv/ready", body)
  }

  confirm(body: ReservRegisterRequest) {
    return this.http.post<ReservRegisterResponse>("/reserv/register", body)
  }

  getList(params: BookingListParams = {}) {
    return this.http.get<BookListResponse>("/reserv/users/list", {
      search_type: params.search_type || "ST101",
      ...params,
    } as Record<string, string | number | boolean | undefined>)
  }

  getUpcoming() {
    return this.http.get<BookListResponse>("/reserv/users/upcoming")
  }

  getGuestBooking(bookId: string, phoneNumber: string) {
    return this.http.get<GuestBookResponse>("/reserv/guest/list", {
      book_id: bookId,
      phone_number: phoneNumber,
    })
  }

  cancel(bookId: string) {
    return this.http.post<void>("/reserv/delete", { book_id: bookId })
  }

  hide(bookId?: string, flag: "I" | "A" = "I") {
    return this.http.post<void>("/reserv/users/delete", {
      book_id: bookId,
      flag,
    })
  }

  getReceiptUrl(bookId: string) {
    return this.http.get<string>("/reserv/receipt", { identifyKey: bookId })
  }
}
