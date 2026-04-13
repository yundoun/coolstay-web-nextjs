import { BookingDetailClient } from "./client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function BookingDetailRoute() {
  return <BookingDetailClient />
}
