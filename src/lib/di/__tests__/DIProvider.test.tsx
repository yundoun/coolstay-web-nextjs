// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { DIProvider, useDI } from "../DIProvider"
import { createDefaultContainer } from "../container"
import type { Container } from "../types"
import type { ReactNode } from "react"

describe("DIProvider", () => {
  it("useDI가 기본 컨테이너를 반환한다", () => {
    const container = createDefaultContainer()

    const wrapper = ({ children }: { children: ReactNode }) => (
      <DIProvider container={container}>{children}</DIProvider>
    )

    const { result } = renderHook(() => useDI(), { wrapper })

    expect(result.current).toBe(container)
    expect(result.current.httpClient).toBeDefined()
    expect(result.current.tokenManager).toBeDefined()
    expect(result.current.storage).toBeDefined()
  })

  it("커스텀 컨테이너를 주입할 수 있다", () => {
    const mockContainer: Container = {
      httpClient: {
        get: async () => ({}),
        post: async () => ({}),
      },
      tokenManager: {
        getToken: async () => ({ accessToken: "mock", secret: "mock" }),
        setToken: () => {},
        clearToken: () => {},
        isAuthenticated: () => false,
        onAuthError: () => {},
      },
      storage: {
        get: () => null,
        set: () => {},
        remove: () => {},
        keys: () => [],
      },
      bookingRepository: {
        getPaymentInfo: async () => ({}) as never,
        prepare: async () => ({}) as never,
        confirm: async () => ({}) as never,
        getList: async () => ({}) as never,
        getUpcoming: async () => ({}) as never,
        getGuestBooking: async () => ({}) as never,
        cancel: async () => {},
        hide: async () => {},
        getReceiptUrl: async () => "",
      },
      homeRepository: {
        getMain: async () => ({}) as never,
        getRegionStores: async () => ({}) as never,
      },
      searchRepository: {
        getRegions: async () => ({}) as never,
        getContentsList: async () => ({}) as never,
        getTotalList: async () => ({}) as never,
        getFilterKeys: async () => ({}) as never,
        getFilterList: async () => ({}) as never,
        getMyAreaList: async () => ({}) as never,
        getKeywordList: async () => ({}) as never,
        getKeywordSearchKeys: async () => ({}) as never,
        getKeywordSearchList: async () => ({}) as never,
      },
      accommodationRepository: {
        getDetail: async () => ({}) as never,
        getImages: async () => ({}) as never,
        getDailyBookStatus: async () => ({}) as never,
        getRefundPolicy: async () => ({}) as never,
      },
    }

    const wrapper = ({ children }: { children: ReactNode }) => (
      <DIProvider container={mockContainer}>{children}</DIProvider>
    )

    const { result } = renderHook(() => useDI(), { wrapper })

    expect(result.current).toBe(mockContainer)
  })

  it("Provider 없이 useDI 호출 시 에러를 throw한다", () => {
    expect(() => {
      renderHook(() => useDI())
    }).toThrow("useDI must be used within a DIProvider")
  })
})
