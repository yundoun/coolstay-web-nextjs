import { describe, it, expect } from "vitest"
import { createDefaultContainer } from "../container"
import type { Container } from "../types"

describe("Container", () => {
  describe("createDefaultContainer", () => {
    it("Container 인터페이스를 만족하는 객체를 반환한다", () => {
      const container = createDefaultContainer()

      expect(container).toBeDefined()
      expect(container.httpClient).toBeDefined()
      expect(container.tokenManager).toBeDefined()
      expect(container.storage).toBeDefined()
    })

    it("httpClient에 get, post 메서드가 있다", () => {
      const container = createDefaultContainer()

      expect(typeof container.httpClient.get).toBe("function")
      expect(typeof container.httpClient.post).toBe("function")
    })

    it("tokenManager에 토큰 관리 메서드가 있다", () => {
      const container = createDefaultContainer()

      expect(typeof container.tokenManager.getToken).toBe("function")
      expect(typeof container.tokenManager.setToken).toBe("function")
      expect(typeof container.tokenManager.clearToken).toBe("function")
      expect(typeof container.tokenManager.isAuthenticated).toBe("function")
    })

    it("storage에 CRUD 메서드가 있다", () => {
      const container = createDefaultContainer()

      expect(typeof container.storage.get).toBe("function")
      expect(typeof container.storage.set).toBe("function")
      expect(typeof container.storage.remove).toBe("function")
      expect(typeof container.storage.keys).toBe("function")
    })

    it("Container 타입으로 할당 가능하다", () => {
      const container: Container = createDefaultContainer()
      expect(container).toBeDefined()
    })

    it("모든 도메인 Repository가 등록되어 있다", () => {
      const container = createDefaultContainer()

      expect(container.bookingRepository).toBeDefined()
      expect(container.homeRepository).toBeDefined()
      expect(container.searchRepository).toBeDefined()
      expect(container.accommodationRepository).toBeDefined()
      expect(container.authRepository).toBeDefined()
      expect(container.mypageRepository).toBeDefined()
      expect(container.settingsRepository).toBeDefined()
      expect(container.eventRepository).toBeDefined()
      expect(container.exhibitionRepository).toBeDefined()
      expect(container.magazineRepository).toBeDefined()
      expect(container.termsRepository).toBeDefined()
      expect(container.couponRepository).toBeDefined()
      expect(container.mileageRepository).toBeDefined()
      expect(container.reviewRepository).toBeDefined()
      expect(container.alarmRepository).toBeDefined()
      expect(container.csRepository).toBeDefined()
      expect(container.friendRepository).toBeDefined()
    })
  })
})
