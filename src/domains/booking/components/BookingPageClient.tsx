"use client"

import { useEffect, useState } from "react"
import { FileSearch } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { getStoreDetail } from "@/domains/accommodation/api/detailApi"
import { mapMotelToDetail } from "@/domains/accommodation/utils/mapMotelToDetail"
import { BookingPageLayout } from "./BookingPageLayout"
import type { BookingContext, BookingType } from "../types"

interface BookingPageClientProps {
  accommodationId: string
  roomId: string
  type: string
  startTime?: string
  endTime?: string
}

export function BookingPageClient({
  accommodationId,
  roomId,
  type,
}: BookingPageClientProps) {
  const [context, setContext] = useState<BookingContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getStoreDetail({ motel_key: accommodationId })
        const detail = mapMotelToDetail(res.motel)

        const room = detail.rooms.find((r) => r.id === roomId)
        if (!room) {
          setError("객실 정보를 찾을 수 없습니다")
          return
        }

        const bookingType: BookingType = type === "rental" ? "rental" : "stay"
        const isRental = bookingType === "rental"
        const price = isRental ? (room.rentalPrice || room.stayPrice) : room.stayPrice
        const originalPrice = isRental ? room.rentalOriginalPrice : room.stayOriginalPrice
        const packageKey = isRental ? room.rentalPackageKey : room.stayPackageKey
        const startHour = isRental ? room.rentalStartHour : room.stayStartHour
        const endHour = isRental ? room.rentalEndHour : room.stayEndHour
        const useHours = isRental ? room.rentalUseHours : undefined

        setContext({
          accommodation: {
            id: detail.id,
            name: detail.name,
            address: detail.address,
            checkInTime: detail.checkInTime || "15:00",
            checkOutTime: detail.checkOutTime || "11:00",
            parkingInfo: detail.amenities.find((a) => a.id === "parking")?.name,
          },
          room: {
            id: room.id,
            name: room.name,
            imageUrl: room.imageUrl,
            maxGuests: room.maxGuests,
            packageKey,
          },
          bookingType,
          price,
          originalPrice,
          usageTime: isRental ? room.rentalTime : undefined,
          startHour,
          endHour,
          useHours,
          availableCoupons: [],
          availableMileage: 0,
          benefitPointRate: detail.benefitPointRate,
        })
      } catch (err) {
        console.error("[BookingPageClient] API 실패:", err)
        setError("숙소 정보를 불러올 수 없습니다")
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [accommodationId, roomId, type])

  if (isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (error || !context) {
    return (
      <Container size="normal" padding="responsive" className="py-20">
        <EmptyState
          icon={FileSearch}
          title="예약 정보를 찾을 수 없습니다"
          description={error || "숙소 또는 객실 정보가 존재하지 않습니다."}
          action={{ label: "숙소로 돌아가기", href: `/accommodations/${accommodationId}` }}
        />
      </Container>
    )
  }

  return <BookingPageLayout context={context} />
}
