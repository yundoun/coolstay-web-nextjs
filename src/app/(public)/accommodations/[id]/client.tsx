"use client"

import { usePathname } from "next/navigation"
import { AccommodationDetailPage } from "@/domains/accommodation/components/AccommodationDetailPage"

export function AccommodationDetailClient() {
  const pathname = usePathname()
  // /web/coolstay/accommodations/{id} or /accommodations/{id}
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const accIdx = segments.indexOf("accommodations")
  const id = accIdx >= 0 ? segments[accIdx + 1] : ""

  return <AccommodationDetailPage storeKey={id} />
}
