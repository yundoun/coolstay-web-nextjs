import { BookingHistoryPage } from "@/domains/booking/components"

export function generateMetadata() {
  return {
    title: "예약 내역 | 꿀스테이",
  }
}

export default function BookingsPage() {
  return <BookingHistoryPage />
}
