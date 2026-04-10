"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // persist hydration 완료 대기
    if (useAuthStore.persist?.hasHydrated?.()) {
      setHydrated(true)
    } else {
      const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
        setHydrated(true)
      })
      return () => unsub?.()
    }
  }, [])

  // 로그아웃 시 로그인 페이지로 이동
  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      const search = searchParams?.toString()
      const fullPath = search ? `${pathname}?${search}` : (pathname ?? "/")
      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`)
    }
  }, [hydrated, isLoggedIn, pathname, searchParams, router])

  // hydration 완료 전이거나 비로그인 상태면 로딩 표시
  if (!hydrated || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
