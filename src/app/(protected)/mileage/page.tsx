import { MileagePage } from "@/domains/mileage/components"

export function generateMetadata() {
  return {
    title: "마일리지 | 꿀스테이",
  }
}

export default function MileageRoute() {
  return <MileagePage />
}
