"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth"

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setHydrated(true)
    } else {
      const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
        setHydrated(true)
      })
      return () => unsub?.()
    }
  }, [])

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      const search = searchParams?.toString()
      const fullPath = search ? `${pathname}?${search}` : (pathname ?? "/")
      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`)
    }
  }, [hydrated, isLoggedIn, pathname, searchParams, router])

  if (!hydrated || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
