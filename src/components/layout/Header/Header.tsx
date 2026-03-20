"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
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

// 항상 투명 헤더
const ALWAYS_TRANSPARENT_PATHS = ["/"]
// 검색 파라미터 없을 때만 투명
const CONDITIONAL_TRANSPARENT_PATHS = ["/search"]

export interface HeaderProps {
  variant?: "solid" | "transparent"
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const isAlwaysTransparent = ALWAYS_TRANSPARENT_PATHS.includes(pathname ?? "")
  const isConditionalTransparent =
    CONDITIONAL_TRANSPARENT_PATHS.includes(pathname ?? "") &&
    (!searchParams || searchParams.toString() === "")

  // variant prop이 없으면 경로 기반으로 자동 결정
  const isTransparentMode = variant
    ? variant === "transparent"
    : isAlwaysTransparent || isConditionalTransparent

  // 투명 모드일 때만 스크롤 감지, solid 모드는 항상 isScrolled=true 처럼 동작
  const showSolidHeader = !isTransparentMode || isScrolled

  useEffect(() => {
    // solid 모드에서는 스크롤 감지 불필요
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
            <Link
              href="/"
              className="shrink-0"
            >
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
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

            {/* Compact Search Bar - Only visible on solid header (desktop) */}
            <div
              className={cn(
                "hidden lg:flex flex-1 max-w-md mx-4",
                "transition-all duration-300",
                showSolidHeader
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <CompactSearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Login Button - Desktop */}
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

              {/* Mobile Menu Button */}
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

      {/* Mobile Navigation Sheet */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={NAV_ITEMS}
      />
    </>
  )
}
