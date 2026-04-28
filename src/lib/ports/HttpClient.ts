/** HTTP 요청 파라미터 타입 */
export type HttpParams = Record<string, string | number | boolean | undefined>

/**
 * HTTP 클라이언트 포트
 *
 * 모든 도메인 API가 의존하는 HTTP 통신 인터페이스.
 * 구현체(FetchHttpClient 등)를 교체하여 테스트·환경별 전환 가능.
 */
export interface HttpClient {
  get<T>(path: string, params?: HttpParams): Promise<T>
  post<T>(path: string, body?: unknown, params?: HttpParams): Promise<T>
}
