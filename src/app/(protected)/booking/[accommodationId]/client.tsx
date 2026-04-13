"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { BookingPageClient } from "@/domains/booking/components/BookingPageClient"

export function BookingPageWrapper() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const segments = (pathname ?? "").split("/").filter(Boolean)
  const idx = segments.indexOf("booking")
  const accommodationId = idx >= 0 ? segments[idx + 1] : ""

  const roomId = searchParams?.get("room") ?? undefined
  const type = searchParams?.get("type") ?? undefined
  const startTime = searchParams?.get("startTime") ?? undefined
  const endTime = searchParams?.get("endTime") ?? undefined

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
