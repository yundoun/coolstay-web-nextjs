"use client"

import Link from "next/link"
import { Instagram, Youtube, MessageCircle } from "lucide-react"
import { Container } from "./Container"
import { cn } from "@/lib/utils"

const CS_LINKS = [
  { label: "자주 묻는 질문", href: "/faq" },
  { label: "1:1 문의", href: "/inquiries" },
  { label: "공지사항", href: "/notices" },
]

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/coolstay_official/", icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCf9B2bSNetycjbDRf46KdTw", icon: Youtube },
  { label: "Blog", href: "https://blog.naver.com/cool_stay", icon: MessageCircle },
]

const LEGAL_LINKS = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy", highlight: true },
  { label: "위치기반서비스 이용약관", href: "/location-terms" },
]

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="border-t pb-16 md:pb-0"
    >
      {/* Main Footer — 모바일: 고객센터 + 회사정보 병렬 */}
      <Container size="normal" className="py-6 md:py-8">
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {/* 고객센터 */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2">고객센터</h3>
            <ul className="space-y-1">
              {CS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Social Links */}
            <div className="flex items-center gap-1.5 mt-3">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center size-7 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors"
                  )}
                >
                  <social.icon className="size-3.5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="text-[11px] text-muted-foreground space-y-0.5">
            <p className="font-medium text-foreground text-xs mb-1">(주)꿀스테이</p>
            <p>대표: 홍길동</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>통신판매업: 제2024-서울강남-12345호</p>
            <p>서울 강남구 테헤란로 123, 10층</p>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <Container size="normal" className="py-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] transition-colors",
                    link.highlight
                      ? "font-semibold text-foreground hover:text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} Coolstay Inc.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
