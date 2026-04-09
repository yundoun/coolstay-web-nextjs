import { describe, it, expect, beforeEach } from "vitest"
import { useSearchModal } from "../search-modal"

// zustand store를 직접 테스트 (getState / setState)
const store = useSearchModal

describe("search-modal store", () => {
  beforeEach(() => {
    store.getState().reset()
    store.setState({ isOpen: false, step: null, businessType: null, mappingBusinessTypes: null })
  })

  describe("openWithBusinessType", () => {
    it("업태와 매핑 타입을 설정하고 region step으로 모달을 연다", () => {
      store.getState().openWithBusinessType("MOTEL", ["MOTEL", "GUESTHOUSE"])

      const state = store.getState()
      expect(state.isOpen).toBe(true)
      expect(state.step).toBe("region")
      expect(state.businessType).toBe("MOTEL")
      expect(state.mappingBusinessTypes).toEqual(["MOTEL", "GUESTHOUSE"])
    })

    it("mappingTypes가 없으면 null로 설정된다", () => {
      store.getState().openWithBusinessType("HOTEL")

      const state = store.getState()
      expect(state.businessType).toBe("HOTEL")
      expect(state.mappingBusinessTypes).toBeNull()
    })
  })

  describe("close", () => {
    it("모달을 닫으면서 businessType을 초기화한다", () => {
      store.getState().openWithBusinessType("MOTEL", ["MOTEL"])
      store.getState().close()

      const state = store.getState()
      expect(state.isOpen).toBe(false)
      expect(state.step).toBeNull()
      expect(state.businessType).toBeNull()
      expect(state.mappingBusinessTypes).toBeNull()
    })
  })

  describe("reset", () => {
    it("모든 검색 조건과 businessType을 초기화한다", () => {
      store.getState().openWithBusinessType("PENSION", ["PENSION"])
      store.getState().setCity("서울")
      store.getState().setArea("강남")
      store.getState().setRegionCode("PENSION_0100001")

      store.getState().reset()

      const state = store.getState()
      expect(state.selectedCity).toBeNull()
      expect(state.selectedArea).toBeNull()
      expect(state.regionCode).toBeNull()
      expect(state.businessType).toBeNull()
      expect(state.mappingBusinessTypes).toBeNull()
      expect(state.adults).toBe(2)
      expect(state.kids).toBe(0)
    })
  })

  describe("open (기존 동작 유지)", () => {
    it("일반 open은 businessType을 변경하지 않는다", () => {
      store.getState().open("date")

      const state = store.getState()
      expect(state.isOpen).toBe(true)
      expect(state.step).toBe("date")
      expect(state.businessType).toBeNull()
    })
  })
})
