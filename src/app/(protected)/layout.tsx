"use client"

import { usePathname, redirect } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const pathname = usePathname()

  if (!isLoggedIn) {
    redirect(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
  }

  return <>{children}</>
}
