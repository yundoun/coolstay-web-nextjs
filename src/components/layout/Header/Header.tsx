"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { CompactSearchBar } from "./CompactSearchBar"
import { MobileNav } from "./MobileNav"

const NAV_ITEMS = [
  { label: "지역별", href: "/regions" },
  { label: "특가", href: "/deals" },
  { label: "테마", href: "/themes" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hero section is approximately 70vh, trigger around 300px
      const scrollThreshold = 300
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        data-slot="header"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-out",
          isScrolled
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
                  isScrolled ? "" : "brightness-0 invert"
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
                    isScrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Compact Search Bar - Only visible when scrolled on desktop */}
            <div
              className={cn(
                "hidden lg:flex flex-1 max-w-md mx-4",
                "transition-all duration-300",
                isScrolled
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
                variant={isScrolled ? "outline" : "ghost"}
                size="sm"
                className={cn(
                  "hidden md:inline-flex gap-2",
                  !isScrolled && "text-white border-white/30 hover:bg-white/10"
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
                  !isScrolled && "text-white hover:bg-white/10"
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
