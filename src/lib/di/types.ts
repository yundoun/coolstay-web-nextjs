import type { HttpClient } from "@/lib/ports/HttpClient"
import type { TokenManager } from "@/lib/ports/TokenManager"
import type { StoragePort } from "@/lib/ports/Storage"
import type { BookingRepository } from "@/domains/booking/ports/BookingRepository"

/**
 * DI 컨테이너 인터페이스
 *
 * 인프라 포트 구현체를 보유하며, 도메인 Repository가 점진적으로 추가된다.
 */
export interface Container {
  httpClient: HttpClient
  tokenManager: TokenManager
  storage: StoragePort
  bookingRepository: BookingRepository
}
