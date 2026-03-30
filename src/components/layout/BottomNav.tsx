"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, Gift, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth"

const NAV_ITEMS = [
  { label: "홈", href: "/", icon: Home },
{ label: "찜숙소", href: "/favorites", icon: Heart },
  { label: "혜택함", href: "/coupons", icon: Gift },
  { label: "마이페이지", href: "/mypage", icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] md:hidden bg-background/95 backdrop-blur-md border-t safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const resolvedHref = href === "/mypage" && !isLoggedIn ? "/login" : href
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={resolvedHref}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                "text-xs transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "fill-primary/20")} />
              <span className={cn("font-medium", active && "font-semibold")}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
