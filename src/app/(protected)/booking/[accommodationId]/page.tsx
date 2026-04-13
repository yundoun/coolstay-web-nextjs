import { Suspense } from "react"
import { BookingPageWrapper } from "./client"

export function generateStaticParams() {
  return [{ accommodationId: "_" }]
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingPageWrapper />
    </Suspense>
  )
}
