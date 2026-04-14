import type { Metadata } from "next"
import { Suspense } from "react"
import Script from "next/script"
import "@/styles/globals.css"
import { Header, Footer, MainContent, BottomNav } from "@/components/layout"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { SearchModal } from "@/components/search/SearchModal"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "꿀스테이 - 꿀같은 휴식을 선물하세요",
  description: "전국 5,000개 이상의 엄선된 숙소에서 특별한 순간을 만나보세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head />
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Script
          src="https://stgstdpay.inicis.com/stdjs/INIStdPay.js"
          strategy="beforeInteractive"
        />
        <Providers>
          <ScrollToTop />
          <Suspense>
            <Header />
          </Suspense>
          <MainContent>{children}</MainContent>
          <Footer />
          <BottomNav />
          <Suspense>
            <SearchModal />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
