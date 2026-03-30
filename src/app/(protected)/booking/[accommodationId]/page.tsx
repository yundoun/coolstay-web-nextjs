import { BookingPageClient } from "@/domains/booking/components/BookingPageClient"

interface BookingPageProps {
  params: Promise<{ accommodationId: string }>
  searchParams: Promise<{ room?: string; type?: string; startTime?: string; endTime?: string }>
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
  const { room: roomId, type, startTime, endTime } = await searchParams

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

  return (
    <BookingPageClient
      accommodationId={accommodationId}
      roomId={roomId}
      type={type}
      startTime={startTime}
      endTime={endTime}
    />
  )
}
