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

/** yyyyMMddHHmmss 포맷 (백엔드 V1_MOBILE_RESERV_DATE_TIME_FORMAT) */
function toDateTimeStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const h = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  const sec = String(d.getSeconds()).padStart(2, "0")
  return `${y}${m}${day}${h}${min}${sec}`
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

        // 쿠폰 목록: 객실 내장 쿠폰 + 사용자 쿠폰함(API) 병합
        let availableCoupons: Coupon[] = []
        let rawCoupons: ApiCoupon[] = []

        // 1) 객실 내장 쿠폰 (숙소 상세 API에서 이미 받은 것)
        const roomCoupons = (isRental ? room.rentalCoupons : room.stayCoupons) ?? []
        const usableRoomCoupons = roomCoupons.filter(
          (c) => c.usable_yn === "Y" && c.dimmed_yn !== "Y"
        ) as unknown as ApiCoupon[]

        // 2) 사용자 쿠폰함 조회 (ST602)
        try {
          const couponRes = await getCouponList({
            search_type: "ST602",
            search_extra: accommodationId,
            item_category_code: isRental ? "010101" : "010102",
            book_dt: toDateTimeStr(new Date()),
            discount_price: String(price),
          })

          const apiCoupons = (couponRes.coupons ?? []).filter((c) => {
            if (c.usable_yn !== "Y" || c.dimmed_yn === "Y") return false
            const storeConstraint = c.constraints?.find((ct) => ct.code === "CC004")
            if (storeConstraint && !storeConstraint.value.includes(accommodationId)) return false
            const minPriceConstraint = c.constraints?.find((ct) => ct.code === "CC001")
            if (minPriceConstraint && Number(minPriceConstraint.value) > price) return false
            return true
          })

          // 병합 (중복 제거: coupon_pk 기준)
          const seenPks = new Set(usableRoomCoupons.map((c) => c.coupon_pk))
          rawCoupons = [
            ...usableRoomCoupons,
            ...apiCoupons.filter((c) => !seenPks.has(c.coupon_pk)),
          ]
        } catch (e) {
          console.error("[BookingPageClient] 쿠폰 조회 실패:", e)
          rawCoupons = usableRoomCoupons
        }

        availableCoupons = rawCoupons.map(mapApiCouponToBooking)

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
