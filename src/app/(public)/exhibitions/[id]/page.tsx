"use client"

import { use } from "react"
import { ExhibitionDetailPage } from "@/domains/exhibition/components"

export default function ExhibitionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <ExhibitionDetailPage exhibitionKey={Number(id)} />
}
