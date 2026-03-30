"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, Heart, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { CompactSearchBar } from "@/domains/search/components/CompactSearchBar"
import { useAuthStore } from "@/lib/stores/auth"

const NAV_ITEMS = [
  { label: "찜목록", href: "/favorites", icon: Heart },
  { label: "혜택함", href: "/coupons", icon: Gift },
  { label: "예약내역", href: "/bookings" },
  { label: "마이페이지", href: "/mypage" },
]

const TRANSPARENT_HEADER_PATHS: string[] = []

export interface HeaderProps {
  variant?: "solid" | "transparent"
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const user = useAuthStore((state) => state.user)
  const [heroSearchVisible, setHeroSearchVisible] = useState(true)
  const isHome = pathname === "/"
  const isTransparentMode = variant
    ? variant === "transparent"
    : TRANSPARENT_HEADER_PATHS.includes(pathname ?? "")

  // IntersectionObserver로 히어로 검색바 감시 (홈에서만)
  useEffect(() => {
    if (!isHome) {
      setHeroSearchVisible(false)
      return
    }

    const timeout = setTimeout(() => {
      const heroSearchBar = document.getElementById("hero-search-bar")
      if (!heroSearchBar) {
        setHeroSearchVisible(false)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          setHeroSearchVisible(entry.isIntersecting)
        },
        { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
      )

      observer.observe(heroSearchBar)
      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timeout)
  }, [isHome])

  const showSolidHeader = isTransparentMode ? !heroSearchVisible : true
  const showHeaderSearch = isHome ? !heroSearchVisible : true

  return (
    <>
      <header
        data-slot="header"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-out",
          showSolidHeader
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <Container size="wide" className="h-16 md:h-[var(--header-height)]">
          <div className="flex h-full items-center justify-between gap-3 md:gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={120}
                height={40}
                className={cn(
                  "h-7 md:h-8 w-auto transition-all",
                  showSolidHeader ? "" : "brightness-0 invert"
                )}
                priority
              />
            </Link>

            {/* 검색 텍스트 필드 */}
            <div
              className={cn(
                "flex-1 max-w-md mx-1 md:mx-4",
                "transition-all duration-300",
                showHeaderSearch
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <CompactSearchBar />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 shrink-0">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    showSolidHeader
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.icon && <item.icon className="size-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                <Button
                  variant={showSolidHeader ? "outline" : "ghost"}
                  size="sm"
                  className={cn(
                    "hidden md:inline-flex gap-2",
                    !showSolidHeader && "text-white border-white/30 hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/mypage">
                    <User className="size-4" />
                    {user?.nickname}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant={showSolidHeader ? "outline" : "ghost"}
                  size="sm"
                  className={cn(
                    "hidden md:inline-flex gap-2",
                    !showSolidHeader && "text-white border-white/30 hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/login">
                    <User className="size-4" />
                    로그인
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </header>
    </>
  )
}
