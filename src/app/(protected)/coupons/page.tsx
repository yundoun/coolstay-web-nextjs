import { Suspense } from "react"
import { BenefitPage } from "@/domains/benefit/components"

export function generateMetadata() {
  return {
    title: "혜택함 | 꿀스테이",
  }
}

export default function CouponsRoute() {
  return (
    <Suspense>
      <BenefitPage />
    </Suspense>
  )
}
