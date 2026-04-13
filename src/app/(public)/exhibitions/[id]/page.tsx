import { Suspense } from "react"
import { ExhibitionDetailClient } from "./client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function ExhibitionDetailRoute() {
  return (
    <Suspense>
      <ExhibitionDetailClient />
    </Suspense>
  )
}
