import type { Container } from "./types"
import { ApiTokenManager } from "@/lib/adapters/ApiTokenManager"
import { FetchHttpClient } from "@/lib/adapters/FetchHttpClient"
import { LocalStorageAdapter } from "@/lib/adapters/LocalStorageAdapter"
import { ApiBookingRepository } from "@/domains/booking/adapters/ApiBookingRepository"

/** 기본 Container 생성 — 실제 API + localStorage 사용 */
export function createDefaultContainer(): Container {
  const tokenManager = new ApiTokenManager()
  const httpClient = new FetchHttpClient(tokenManager)
  const storage = new LocalStorageAdapter()
  const bookingRepository = new ApiBookingRepository(httpClient)

  return { httpClient, tokenManager, storage, bookingRepository }
}

/** 싱글톤 기본 컨테이너 */
export const defaultContainer = createDefaultContainer()
