/**
 * 저장소 포트
 *
 * localStorage, sessionStorage 등 클라이언트 저장소를 추상화.
 * SSR 환경에서도 안전하게 동작해야 한다.
 */
export interface StoragePort {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  keys(): string[]
}
