"use client"

import { usePathname } from "next/navigation"
import { BookingDetailPage } from "@/domains/booking/components"

export function BookingDetailClient() {
  const pathname = usePathname()
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const idx = segments.indexOf("bookings")
  const id = idx >= 0 ? segments[idx + 1] : ""

  return <BookingDetailPage bookingId={id} />
}
