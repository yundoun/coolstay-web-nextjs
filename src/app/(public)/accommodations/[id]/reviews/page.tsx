import { AccommodationReviewsClient } from "./client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function AccommodationReviewsPage() {
  return <AccommodationReviewsClient />
}
