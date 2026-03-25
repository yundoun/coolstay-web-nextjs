"use client"

import { use } from "react"
import { BookingDetailPage } from "@/domains/booking/components"

export default function BookingDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <BookingDetailPage bookingId={id} />
}
