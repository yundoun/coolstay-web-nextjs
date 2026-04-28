"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, Heart, Gift, Bell, ChevronLeft, Home, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/utils"
import { CompactSearchBar } from "@/domains/search/components/CompactSearchBar"
import { useAuthStore } from "@/lib/stores/auth"
import {
  getRouteLayoutConfig,
  type HeaderVariant,
} from "@/components/layout/route-layout-config"
import { useHeaderStore } from "@/lib/stores/header"

const NAV_ITEMS = [
  { label: "찜목록", href: "/favorites", icon: Heart },
  { label: "혜택함", href: "/coupons", icon: Gift },
  { label: "예약내역", href: "/bookings" },
  { label: "마이페이지", href: "/mypage" },
]

export interface HeaderProps {
  variant?: "solid" | "transparent"
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const user = useAuthStore((state) => state.user)
  const routeConfig = getRouteLayoutConfig(pathname ?? "/")
  const headerVariant: HeaderVariant = routeConfig.headerVariant
  const dynamicTitle = useHeaderStore((s) => s.dynamicTitle)
  const headerTitle = dynamicTitle ?? routeConfig.title ?? ""
  const isHome = pathname === "/"

  // 홈에서만: 콘텐츠 검색바가 보이면 헤더 검색바 숨김
  const [hideHeaderSearch, setHideHeaderSearch] = useState(isHome)

  useEffect(() => {
    if (!isHome) {
      setHideHeaderSearch(false)
      return
    }

    setHideHeaderSearch(true)

    const observer = new IntersectionObserver(
      ([entry]) => setHideHeaderSearch(entry.isIntersecting),
      { threshold: 0 }
    )

    const check = () => {
      const el = document.getElementById("content-search-bar")
      if (el) observer.observe(el)
      else requestAnimationFrame(check)
    }
    check()

    return () => observer.disconnect()
  }, [isHome])

  // back variant
  if (headerVariant === "back") {
    return (
      <header data-slot="header" className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <Container size="narrow" className="h-14 md:h-[var(--header-height)]">
          <div className="flex h-full items-center">
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2" onClick={() => router.back()}>
              <ChevronLeft className="size-5" />
            </Button>
            <span className="flex-1 text-center font-semibold text-base truncate px-2">{headerTitle}</span>
            <div className="flex items-center shrink-0 -mr-2">
              {routeConfig.rightActions?.includes("home") && (
                <Button variant="ghost" size="icon" asChild><Link href="/"><Home className="size-5" /></Link></Button>
              )}
              {routeConfig.rightActions?.includes("share") && (
                <Button variant="ghost" size="icon" onClick={() => { if (navigator.share) navigator.share({ url: window.location.href }) }}><Share2 className="size-5" /></Button>
              )}
              {routeConfig.rightActions?.includes("favorite") && (
                <Button variant="ghost" size="icon"><Heart className="size-5" /></Button>
              )}
              {!routeConfig.rightActions?.length && <div className="w-10" />}
            </div>
          </div>
        </Container>
      </header>
    )
  }

  // minimal variant
  if (headerVariant === "minimal") {
    return (
      <header data-slot="header" className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <Container size="narrow" className="h-14 md:h-[var(--header-height)]">
          <div className="flex h-full items-center justify-center">
            <Button variant="ghost" size="icon" asChild><Link href="/"><Home className="size-5" /></Link></Button>
          </div>
        </Container>
      </header>
    )
  }

  // default variant — 항상 동일한 구조, 홈 최상단에서만 검색바 숨김
  return (
    <header data-slot="header" className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <Container size="narrow" className="h-14 md:h-[var(--header-height)]">
        <div className="flex h-full items-center gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/coolstay_logo.png`}
              alt="꿀스테이"
              width={120}
              height={40}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* 검색바 — 홈 최상단에서만 숨김 */}
          <div className={cn(
            "flex-1 max-w-md transition-all duration-200",
            hideHeaderSearch ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <CompactSearchBar />
          </div>

          {/* 모바일: 알림 아이콘 */}
          <Link href="/notifications" className="md:hidden shrink-0">
            <Bell className="size-5 text-muted-foreground" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-foreground hover:bg-muted"
              >
                {item.icon && <item.icon className="size-4" />}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop: 로그인/유저 */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <Link href="/mypage"><User className="size-4" />{user?.nickname}</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <Link href="/login"><User className="size-4" />로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
