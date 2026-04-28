import type { HttpClient } from "@/lib/ports/HttpClient"
import type { TokenManager } from "@/lib/ports/TokenManager"
import type { StoragePort } from "@/lib/ports/Storage"

/**
 * DI 컨테이너 인터페이스
 *
 * 인프라 포트 구현체를 보유하며, 각 도메인 Repository는
 * Phase 3 이후 점진적으로 추가된다.
 */
export interface Container {
  httpClient: HttpClient
  tokenManager: TokenManager
  storage: StoragePort
}
