import { Suspense } from "react"
import { Search2PageLayout } from "@/domains/search2/components"

export const metadata = {
  title: "숙소 검색 | 쿨스테이",
  description: "2026 트렌드에 맞춘 몰입형 숙소 검색 경험",
}

function Search2PageContent() {
  return <Search2PageLayout />
}

export default function Search2Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }
    >
      <Search2PageContent />
    </Suspense>
  )
}
