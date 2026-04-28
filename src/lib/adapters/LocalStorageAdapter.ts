import type { StoragePort } from "@/lib/ports/Storage"

/**
 * localStorage 기반 StoragePort 구현체
 *
 * SSR 환경에서는 storage가 undefined이므로 no-op으로 동작한다.
 */
export class LocalStorageAdapter implements StoragePort {
  private storage: Storage | undefined

  constructor(storage?: Storage | undefined) {
    this.storage = storage !== undefined
      ? storage
      : typeof window !== "undefined" ? window.localStorage : undefined
  }

  get<T>(key: string): T | null {
    if (!this.storage) return null
    const raw = this.storage.getItem(key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storage) return
    this.storage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    if (!this.storage) return
    this.storage.removeItem(key)
  }

  keys(): string[] {
    if (!this.storage) return []
    const result: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key !== null) result.push(key)
    }
    return result
  }
}
