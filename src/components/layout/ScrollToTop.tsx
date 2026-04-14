"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * 페이지 전환 시 스크롤을 최상단으로 초기화한다.
 * 브라우저 뒤로가기/앞으로가기(popstate)는 브라우저 기본 스크롤 복원에 맡긴다.
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const isPopState = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      isPopState.current = true
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    if (isPopState.current) {
      isPopState.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
