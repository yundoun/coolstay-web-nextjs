"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { ExhibitionDetailPage, PackageExhibitionPage } from "@/domains/exhibition/components"

export function ExhibitionDetailClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const type = searchParams?.get("type") ?? undefined

  const segments = (pathname ?? "").split("/").filter(Boolean)
  const idx = segments.indexOf("exhibitions")
  const id = idx >= 0 ? segments[idx + 1] : ""
  const key = Number(id)

  if (type === "PACKAGE_EXHIBITION_GROUP") {
    return <PackageExhibitionPage groupKey={key} />
  }

  return (
    <ExhibitionDetailPage
      exhibitionKey={key}
      exhibitionType={type || "EXHIBITION"}
    />
  )
}
