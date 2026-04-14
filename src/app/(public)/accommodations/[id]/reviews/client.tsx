"use client"

import { usePathname } from "next/navigation"
import { AccommodationReviewsPage } from "@/domains/accommodation/components/AccommodationReviewsPage"

export function AccommodationReviewsClient() {
  const pathname = usePathname()
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const accIdx = segments.indexOf("accommodations")
  const accommodationId = accIdx >= 0 ? segments[accIdx + 1] : ""

  return <AccommodationReviewsPage accommodationId={accommodationId} />
}
