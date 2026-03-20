import { BookingCompletePage } from "@/domains/booking/components"

export function generateMetadata() {
  return {
    title: "예약 완료 | 꿀스테이",
  }
}

export default function BookingCompleteRoute() {
  return <BookingCompletePage />
}
