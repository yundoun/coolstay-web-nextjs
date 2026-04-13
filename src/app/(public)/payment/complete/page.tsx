import { Suspense } from "react"
import { PaymentCompleteClient } from "./client"

export default function PaymentCompletePage() {
  return (
    <Suspense>
      <PaymentCompleteClient />
    </Suspense>
  )
}
