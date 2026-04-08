"use client"

import { use } from "react"
import { ExhibitionDetailPage } from "@/domains/exhibition/components"

export default function ExhibitionDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = use(params)
  const { type } = use(searchParams)
  return (
    <ExhibitionDetailPage
      exhibitionKey={Number(id)}
      exhibitionType={type || "EXHIBITION"}
    />
  )
}
