import type { Container } from "./types"
import { ApiTokenManager } from "@/lib/adapters/ApiTokenManager"
import { FetchHttpClient } from "@/lib/adapters/FetchHttpClient"
import { LocalStorageAdapter } from "@/lib/adapters/LocalStorageAdapter"
import { ApiBookingRepository } from "@/domains/booking/adapters/ApiBookingRepository"
import { ApiHomeRepository } from "@/domains/home/adapters/ApiHomeRepository"
import { ApiSearchRepository } from "@/domains/search/adapters/ApiSearchRepository"
import { ApiAccommodationRepository } from "@/domains/accommodation/adapters/ApiAccommodationRepository"

/** 기본 Container 생성 — 실제 API + localStorage 사용 */
export function createDefaultContainer(): Container {
  const tokenManager = new ApiTokenManager()
  const httpClient = new FetchHttpClient(tokenManager)
  const storage = new LocalStorageAdapter()

  return {
    httpClient,
    tokenManager,
    storage,
    bookingRepository: new ApiBookingRepository(httpClient),
    homeRepository: new ApiHomeRepository(httpClient),
    searchRepository: new ApiSearchRepository(httpClient),
    accommodationRepository: new ApiAccommodationRepository(httpClient),
  }
}

/** 싱글톤 기본 컨테이너 */
export const defaultContainer = createDefaultContainer()
