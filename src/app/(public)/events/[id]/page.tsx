"use client"

import { use } from "react"
import { EventDetailPage } from "@/domains/event/components"

export default function EventDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <EventDetailPage eventKey={Number(id)} />
}
