"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, Gift, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth"
import { getRouteLayoutConfig } from "@/components/layout/route-layout-config"

const NAV_ITEMS = [
  { label: "홈", href: "/", icon: Home },
  { label: "내주변", href: "/search", icon: Search },
  { label: "찜숙소", href: "/favorites", icon: Heart },
  { label: "혜택함", href: "/coupons", icon: Gift },
  { label: "마이페이지", href: "/mypage", icon: MoreHorizontal },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const config = getRouteLayoutConfig(pathname ?? "/")
  if (!config.showBottomNav) return null

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] md:hidden bg-background border-t safe-area-bottom">
      <div className="flex items-center justify-around h-[63px] px-[18px]">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const resolvedHref = href === "/mypage" && !isLoggedIn ? "/login" : href
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={resolvedHref}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                "transition-colors",
              )}
            >
              <Icon
                className={cn(
                  "size-[34px] p-1.5",
                  active ? "text-foreground" : "text-[#888888]"
                )}
              />
              <span
                className={cn(
                  "text-[11px]",
                  active ? "text-foreground font-semibold" : "text-[#888888]"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
