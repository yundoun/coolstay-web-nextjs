import type { Metadata } from "next"
import "@/styles/globals.css"
import { Header, Footer, MainContent } from "@/components/layout"
import { SearchModal } from "@/components/search/SearchModal"

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
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Header />
        <MainContent>{children}</MainContent>
        <Footer />
        <SearchModal />
      </body>
    </html>
  )
}
