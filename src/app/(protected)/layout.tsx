"use client"

import { usePathname, redirect } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const hasHydrated = useAuthStore.persist.hasHydrated()
  const pathname = usePathname()

  // hydration 완료 전에는 판단하지 않음
  if (!hasHydrated) {
    return null
  }

  if (!isLoggedIn) {
    redirect(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
  }

  return <>{children}</>
}
