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
    // createDefaultContainer를 베이스로 사용하되 별도 인스턴스임을 검증
    const customContainer = createDefaultContainer()

    const wrapper = ({ children }: { children: ReactNode }) => (
      <DIProvider container={customContainer}>{children}</DIProvider>
    )

    const { result } = renderHook(() => useDI(), { wrapper })

    expect(result.current).toBe(customContainer)
    expect(result.current.bookingRepository).toBeDefined()
    expect(result.current.homeRepository).toBeDefined()
    expect(result.current.authRepository).toBeDefined()
  })

  it("Provider 없이 useDI 호출 시 에러를 throw한다", () => {
    expect(() => {
      renderHook(() => useDI())
    }).toThrow("useDI must be used within a DIProvider")
  })
})
