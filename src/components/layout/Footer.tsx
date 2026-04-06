"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube, MessageCircle } from "lucide-react"
import { Container } from "./Container"
import { cn } from "@/lib/utils"

const FOOTER_LINKS = {
  고객센터: [
    { label: "자주 묻는 질문", href: "/faq" },
    { label: "1:1 문의", href: "/inquiries" },
    { label: "공지사항", href: "/notices" },
    { label: "이용가이드", href: "/guide" },
  ],
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "Blog", href: "https://blog.naver.com", icon: MessageCircle },
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
      className="bg-neutral-100 dark:bg-neutral-900 border-t"
    >
      {/* Main Footer */}
      <Container size="wide" className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              꿀같은 휴식을 선물하세요.
              <br />
              전국 5,000개 이상의 엄선된 숙소에서
              <br />
              특별한 순간을 만나보세요.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center size-10 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors"
                  )}
                >
                  <social.icon className="size-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <Container size="wide" className="py-6">
          {/* Company Info */}
          <div className="text-xs text-muted-foreground space-y-1 mb-4">
            <p>
              <span className="font-medium">(주)꿀스테이</span>
              <span className="mx-2">|</span>
              대표: 홍길동
              <span className="mx-2">|</span>
              사업자등록번호: 123-45-67890
            </p>
            <p>
              통신판매업신고: 제2024-서울강남-12345호
              <span className="mx-2">|</span>
              관광사업등록번호: 제2024-000123호
            </p>
            <p>
              주소: 서울특별시 강남구 테헤란로 123, 꿀스테이빌딩 10층
              <span className="mx-2">|</span>
              고객센터: 1588-0000
            </p>
          </div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {LEGAL_LINKS.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs transition-colors",
                    link.highlight
                      ? "font-semibold text-foreground hover:text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Coolstay Inc. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
