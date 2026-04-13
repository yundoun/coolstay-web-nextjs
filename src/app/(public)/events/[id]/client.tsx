"use client"

import { usePathname } from "next/navigation"
import { EventDetailPage } from "@/domains/event/components"

export function EventDetailClient() {
  const pathname = usePathname()
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const idx = segments.indexOf("events")
  const id = idx >= 0 ? segments[idx + 1] : ""

  return <EventDetailPage eventKey={Number(id)} />
}
