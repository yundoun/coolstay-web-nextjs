"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { CompactSearchBar } from "./CompactSearchBar"
import { MobileNav } from "./MobileNav"

const NAV_ITEMS = [
  { label: "검색", href: "/search" },
  { label: "예약내역", href: "/bookings" },
  { label: "마이페이지", href: "/mypage" },
]

const TRANSPARENT_HEADER_PATHS = ["/"]

export interface HeaderProps {
  variant?: "solid" | "transparent"
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const isHome = pathname === "/"
  const isTransparentMode = variant
    ? variant === "transparent"
    : TRANSPARENT_HEADER_PATHS.includes(pathname ?? "")

  const showSolidHeader = !isTransparentMode || isScrolled

  // 홈에서 히어로 검색바가 스크롤 아웃되면 pill 표시
  const showSearchPill = isHome && isScrolled

  useEffect(() => {
    if (!isTransparentMode) return

    const handleScroll = () => {
      const scrollThreshold = 300
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isTransparentMode])

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
          <div className="flex h-full items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={120}
                height={40}
                className={cn(
                  "h-8 w-auto transition-all",
                  showSolidHeader ? "" : "brightness-0 invert"
                )}
                priority
              />
            </Link>

            {/* Compact Search Pill — 홈에서 히어로 스크롤 아웃 시만 */}
            <div
              className={cn(
                "flex-1 max-w-lg mx-2 md:mx-4",
                "transition-all duration-300",
                showSearchPill
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <CompactSearchBar />
            </div>

            {/* Desktop Navigation — pill 없을 때만 */}
            <nav
              className={cn(
                "hidden md:flex items-center gap-1",
                "transition-all duration-300",
                showSearchPill && "md:hidden lg:flex"
              )}
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    showSolidHeader
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
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

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden",
                  !showSolidHeader && "text-white hover:bg-white/10"
                )}
                onClick={() => setIsMobileNavOpen(true)}
              >
                <Menu className="size-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={NAV_ITEMS}
      />
    </>
  )
}
