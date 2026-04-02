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
import { getCouponList } from "@/domains/coupon/api/couponApi"
import type { Coupon as ApiCoupon } from "@/domains/coupon/types"
import { BookingPageLayout } from "./BookingPageLayout"
import type { BookingContext, BookingType, Coupon } from "../types"

/** YYYYMMDD 포맷 */
function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}${m}${day}`
}

/** API 쿠폰 → 예약 UI용 쿠폰 변환 */
function mapApiCouponToBooking(c: ApiCoupon): Coupon {
  const minPriceConstraint = c.constraints?.find((ct) => ct.code === "CC001")
  return {
    id: String(c.coupon_pk),
    name: c.title,
    discountType: c.discount_type === "AMOUNT" ? "fixed" : "percent",
    discountValue: c.discount_amount,
    minOrderAmount: minPriceConstraint ? Number(minPriceConstraint.value) : 0,
  }
}

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

        // 쿠폰 목록 조회
        let availableCoupons: Coupon[] = []
        let rawCoupons: ApiCoupon[] = []
        try {
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          const couponRes = await getCouponList({
            search_type: "ST601",
            item_category_code: isRental ? "010101" : "010102",
            book_dt: toDateStr(today),
            book_out_dt: toDateStr(isRental ? today : tomorrow),
            discount_price: String(price),
          })

          rawCoupons = couponRes.coupons.filter((c) => {
            if (c.usable_yn !== "Y" || c.dimmed_yn === "Y") return false
            // CC004: 적용 제휴점 제한 — 값이 있으면 현재 숙소 key 포함 여부 확인
            const storeConstraint = c.constraints?.find((ct) => ct.code === "CC004")
            if (storeConstraint && !storeConstraint.value.includes(accommodationId)) return false
            // CC001: 최소 객실 금액
            const minPriceConstraint = c.constraints?.find((ct) => ct.code === "CC001")
            if (minPriceConstraint && Number(minPriceConstraint.value) > price) return false
            return true
          })
          availableCoupons = rawCoupons.map(mapApiCouponToBooking)
        } catch (e) {
          console.error("[BookingPageClient] 쿠폰 조회 실패:", e)
        }

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
          availableCoupons,
          rawCoupons,
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
