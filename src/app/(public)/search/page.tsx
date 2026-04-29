import { Suspense } from "react"
import { SearchPageLayout } from "@/domains/search/components"
import { SearchPageSkeleton } from "@/domains/search/components/SearchPageSkeleton"

export const metadata = {
  title: "숙소 검색 | 쿨스테이",
  description: "원하는 조건으로 숙소를 검색하세요",
}

function SearchPageContent() {
  return <SearchPageLayout />
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  )
}
