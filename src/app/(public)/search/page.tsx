import { Suspense } from "react"
import { SearchPageLayout } from "@/domains/search/components"

export const metadata = {
  title: "숙소 검색 | 쿨스테이",
  description: "원하는 조건으로 숙소를 검색하세요",
}

function SearchPageContent() {
  return <SearchPageLayout />
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
