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

  // hydration 완료 전에는 판단하지 않음
  if (!hydrated) {
    return null
  }

  if (!isLoggedIn) {
    redirect(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
  }

  return <>{children}</>
}
