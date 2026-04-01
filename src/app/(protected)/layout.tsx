"use client"

import { useState, useEffect } from "react"
import { usePathname, redirect } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const pathname = usePathname()
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

  // hydration 완료 전에는 로딩 표시
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) {
    redirect(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
  }

  return <>{children}</>
}
