"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { prepareBooking, confirmBooking } from "../api/reservationApi"
import type { ReservReadyRequest } from "@/lib/api/types"
import type { BookingContext, BookerInfo, PaymentMethod, PaymentSummary, BookingResult } from "../types"

interface SubmitParams {
  context: BookingContext
  bookerInfo: BookerInfo
  hasVehicle: boolean
  paymentMethod: PaymentMethod
  paymentSummary: PaymentSummary
  mileageUsed: number
  selectedCouponId: string | null
  selectedTime?: string
}

/** 웹 결제수단 → API payment_method / payment_pg 매핑
 *  TODO: PG SDK 연동 후 실제 PG 코드 사용 (INICIS, TOSS_PAYMENTS 등)
 *        현재는 PG SDK 미연동이므로 모든 결제를 현장결제(SITE)로 처리
 */
function mapPaymentToApi(method: PaymentMethod) {
  switch (method) {
    case "card":
    case "transfer":
    case "phone":
      // PG SDK 연동 전까지 현장결제로 대체
      return { payment_pg: "", payment_method: "SITE" }
    case "onsite":
    default:
      return { payment_pg: "", payment_method: "SITE" }
  }
}

/** 날짜+시간 → yyyyMMddHHmmss 포맷 */
function formatDatetime(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const h = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${y}${m}${d}${h}${min}00`
}

export function useBookingSubmit() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (params: SubmitParams) => {
    const {
      context, bookerInfo, hasVehicle, paymentMethod,
      paymentSummary, mileageUsed, selectedCouponId, selectedTime,
    } = params

    setIsLoading(true)
    setError(null)

    try {
      // 체크인/체크아웃 시간 계산 (daily_extras의 STIME/ETIME/UTIME 사용)
      const now = new Date()
      const checkIn = new Date(now)
      const checkOut = new Date(now)

      if (context.bookingType === "rental") {
        // 대실: 선택한 시간 or STIME부터, UTIME 시간 후 종료
        const useHours = context.useHours || 4
        if (selectedTime) {
          const [h, m] = selectedTime.split(":").map(Number)
          checkIn.setHours(h, m, 0, 0)
          checkOut.setHours(h + useHours, m, 0, 0)
        } else {
          // 시간 미선택 시 STIME 기본값 사용
          const startH = context.startHour ?? 10
          checkIn.setHours(startH, 0, 0, 0)
          checkOut.setHours(startH + useHours, 0, 0, 0)
        }
      } else {
        // 숙박: STIME으로 체크인, 다음날 ETIME으로 체크아웃
        const ciH = context.startHour ?? parseInt((context.accommodation.checkInTime || "15").split(":")[0])
        const coH = context.endHour ?? parseInt((context.accommodation.checkOutTime || "11").split(":")[0])
        checkIn.setHours(ciH, 0, 0, 0)
        checkOut.setDate(checkOut.getDate() + 1)
        checkOut.setHours(coH, 0, 0, 0)
      }

      // 쿠폰 정보 구성
      const coupons = selectedCouponId
        ? context.availableCoupons
            .filter((c) => c.id === selectedCouponId)
            .map((c) => ({
              code: c.id,
              title: c.name,
              description: "",
              category_code: "",
              category_description: "",
              type: "DOWNLOAD",
              discount_type: c.discountType === "fixed" ? "AMOUNT" : "RATE",
              discount_amount: c.discountValue,
              total_amount: 0,
              remain_amount: 0,
              dup_use_yn: "N",
              usable_yn: "Y",
              status: "ACTIVE",
              start_dt: "",
              end_dt: "",
              usable_start_dt: "",
              usable_end_dt: "",
            }))
        : undefined

      const { payment_pg, payment_method } = mapPaymentToApi(paymentMethod)

      const readyBody: ReservReadyRequest = {
        motel_key: context.accommodation.id,
        item_key: context.room.packageKey || context.room.id,
        item_type: context.bookingType === "rental" ? "010101" : "010102",
        book_start_dt: formatDatetime(checkIn),
        book_end_dt: formatDatetime(checkOut),
        book_user_name: bookerInfo.name,
        book_user_number: bookerInfo.phone.replace(/-/g, ""),
        vehicle_yn: hasVehicle ? "Y" : "N",
        price: context.originalPrice || context.price,
        discount_price: context.price,
        total_price: paymentSummary.totalAmount,
        coupons,
        benefit_mileage_rate: context.benefitPointRate,
        mileage: mileageUsed > 0 ? mileageUsed : undefined,
        payment_pg,
        payment_method,
      }

      // Step 1: 예약 준비
      const readyResult = await prepareBooking(readyBody)
      const bookId = readyResult.book_id

      // Step 2: 현장결제/SITE는 ready만으로 완료, 온라인결제는 PG→register 필요
      // TODO: PG SDK 연동 후 온라인 결제 플로우 구현
      //   1. PG 결제 모듈 호출 → imp_uid 획득
      //   2. confirmBooking({ merchant_uid: bookId, payment_imp_uid: imp_uid, ... })
      // 현재는 모든 결제가 SITE(현장결제)로 처리되므로 register 호출 불필요

      // 예약 완료 결과 구성
      const fmt = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
      }

      const result: BookingResult = {
        bookingId: bookId,
        accommodationName: context.accommodation.name,
        roomName: context.room.name,
        bookingType: context.bookingType,
        checkIn: fmt(checkIn),
        checkOut: fmt(checkOut),
        usageTime: context.usageTime,
        bookerName: bookerInfo.name,
        bookerPhone: bookerInfo.phone,
        paymentMethod,
        totalAmount: paymentSummary.totalAmount,
        earnedMileage: Math.floor(
          paymentSummary.totalAmount * (context.benefitPointRate / 100)
        ),
      }

      sessionStorage.setItem("bookingResult", JSON.stringify(result))
      router.push(`/booking/${context.accommodation.id}/complete`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "예약 처리 중 오류가 발생했습니다"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return { submit, isLoading, error }
}
