"use client"

import Link from "next/link"
import {
  User,
  CalendarDays,
  Heart,
  MessageSquare,
  FileText,
  Bell,
  PartyPopper,
  Lightbulb,
  HelpCircle,
  Settings,
  ChevronRight,
  Ticket,
  Coins,
  PenLine,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth"
import { useMypageInfo } from "../hooks/useMypageInfo"

interface MenuItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
}

const ACCOUNT_MENU: MenuItem[] = [
  { icon: CalendarDays, label: "예약/이용 내역", href: "/bookings" },
  { icon: Heart, label: "최근/관심 숙소", href: "/favorites" },
  { icon: PenLine, label: "나의 후기", href: "/reviews" },
  { icon: MessageSquare, label: "나의 문의", href: "/inquiries" },
  { icon: FileText, label: "이용 약관", href: "/terms" },
]

const SUPPORT_MENU: MenuItem[] = [
  { icon: Bell, label: "공지사항", href: "/notices", badge: "NEW" },
  { icon: PartyPopper, label: "이벤트", href: "/events" },
  { icon: Lightbulb, label: "꿀팁 가이드", href: "/guide" },
  { icon: HelpCircle, label: "자주 묻는 질문", href: "/faq" },
  { icon: Settings, label: "설정", href: "/settings" },
]

export function MyPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const { info } = useMypageInfo()

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      {/* Profile Section */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
            <User className="size-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                멤버
              </Badge>
            </div>
            <Link href="/mypage/profile" className="hover:underline">
              <h2 className="text-xl font-bold mt-1">{user?.nickname}</h2>
            </Link>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/settings">
              <Settings className="size-5" />
            </Link>
          </Button>
        </div>

        {/* Coupon & Mileage */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Link
            href="/coupons"
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <Ticket className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">쿠폰</p>
              <p className="text-lg font-bold">{info?.coupon_count ?? 0}장</p>
            </div>
          </Link>
          <Link
            href="/mileage"
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <Coins className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">마일리지</p>
              <p className="text-lg font-bold">
                {(info?.mileage_store_count ?? 0).toLocaleString()}P
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Account Menu */}
      <div className="mt-6">
        <MenuSection items={ACCOUNT_MENU} />
      </div>

      <Separator className="my-2" />

      {/* Support Menu */}
      <div>
        <MenuSection items={SUPPORT_MENU} />
      </div>

      {/* Logout */}
      <div className="mt-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="size-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </div>

      {/* App Version */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          꿀스테이 웹 v1.0.0
        </p>
      </div>
    </Container>
  )
}

function MenuSection({ items }: { items: MenuItem[] }) {
  return (
    <nav>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <item.icon className="size-5 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          {item.badge && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {item.badge}
            </Badge>
          )}
          <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        </Link>
      ))}
    </nav>
  )
}
