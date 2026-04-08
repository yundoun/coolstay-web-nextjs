"use client"

import { use } from "react"
import { ExhibitionDetailPage, PackageExhibitionPage } from "@/domains/exhibition/components"

export default function ExhibitionDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = use(params)
  const { type } = use(searchParams)
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
