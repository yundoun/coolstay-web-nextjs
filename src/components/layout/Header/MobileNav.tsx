"use client"

import Link from "next/link"
import Image from "next/image"
import { X, User, Search, MapPin, Heart, Clock } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
}

const QUICK_LINKS = [
  { label: "검색", href: "/search", icon: Search },
  { label: "내 주변", href: "/nearby", icon: MapPin },
  { label: "찜 목록", href: "/wishlist", icon: Heart },
  { label: "최근 본", href: "/recent", icon: Clock },
]

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col">
          {/* Login Section */}
          <div className="p-4 bg-muted/50">
            <Button className="w-full gap-2" asChild>
              <Link href="/login" onClick={onClose}>
                <User className="size-4" />
                로그인 / 회원가입
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="p-2">
            <div className="grid grid-cols-4 gap-1">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    "transition-colors"
                  )}
                >
                  <link.icon className="size-5" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* Main Navigation */}
          <nav className="p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg",
                  "text-foreground font-medium",
                  "hover:bg-muted transition-colors"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Separator />

          {/* Additional Links */}
          <nav className="p-2">
            <Link
              href="/help"
              onClick={onClose}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg",
                "text-muted-foreground text-sm",
                "hover:bg-muted transition-colors"
              )}
            >
              고객센터
            </Link>
            <Link
              href="/partner"
              onClick={onClose}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg",
                "text-muted-foreground text-sm",
                "hover:bg-muted transition-colors"
              )}
            >
              파트너 등록
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
