import { BookingPageLayout } from "@/domains/booking/components"
import { getBookingContext } from "@/domains/booking/data/mock"

interface BookingPageProps {
  params: Promise<{ accommodationId: string }>
  searchParams: Promise<{ room?: string; type?: string }>
}

export async function generateMetadata() {
  return {
    title: "예약 | 꿀스테이",
  }
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { accommodationId } = await params
  const { room: roomId, type } = await searchParams

  if (!roomId || !type) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">잘못된 접근입니다</h1>
          <p className="text-muted-foreground">객실 정보가 필요합니다.</p>
        </div>
      </div>
    )
  }

  const context = getBookingContext(accommodationId, roomId, type)

  if (!context) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">예약 정보를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">숙소 또는 객실 정보가 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  return <BookingPageLayout context={context} />
}
