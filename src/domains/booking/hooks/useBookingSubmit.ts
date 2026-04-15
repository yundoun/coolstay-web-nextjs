"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { prepareBooking, confirmBooking } from "../api/reservationApi"
import type { ReservReadyRequest } from "@/lib/api/types"
import type { BookingContext, BookerInfo, PaymentMethod, PaymentSummary, BookingResult } from "../types"
import type { InicisPaymentParams } from "../utils/inicis"

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

/** 웹 결제수단 → API payment_method / payment_pg 매핑 */
function mapPaymentToApi(method: PaymentMethod) {
  switch (method) {
    case "card":
      return { payment_pg: "INICIS_DIR", payment_method: "CARD" }
    case "transfer":
      return { payment_pg: "INICIS_DIR", payment_method: "TRANS" }
    case "phone":
      return { payment_pg: "INICIS_DIR", payment_method: "PHONE" }
    case "onsite":
    default:
      return { payment_pg: "", payment_method: "SITE" }
  }
}

/** 결제수단 → 이니시스 PC 웹표준 gopaymethod */
function toInicisPayMethod(method: PaymentMethod): string {
  switch (method) {
    case "card": return "Card"
    case "transfer": return "DirectBank"
    case "phone": return "HPP"
    default: return "Card"
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
  const [inicisParams, setInicisParams] = useState<InicisPaymentParams | null>(null)

  const submit = useCallback(async (params: SubmitParams) => {
    const {
      context, bookerInfo, hasVehicle, paymentMethod,
      paymentSummary, mileageUsed, selectedCouponId, selectedTime,
    } = params

    setIsLoading(true)
    setError(null)

    try {
      // 체크인/체크아웃 시간 계산
      const now = new Date()
      const checkIn = new Date(now)
      const checkOut = new Date(now)

      if (context.bookingType === "rental") {
        const useHours = context.useHours || 4
        if (selectedTime) {
          const [h, m] = selectedTime.split(":").map(Number)
          checkIn.setHours(h, m, 0, 0)
          checkOut.setHours(h + useHours, m, 0, 0)
        } else {
          const startH = context.startHour ?? 10
          checkIn.setHours(startH, 0, 0, 0)
          checkOut.setHours(startH + useHours, 0, 0, 0)
        }
      } else {
        const ciH = context.startHour ?? parseInt((context.accommodation.checkInTime || "15").split(":")[0])
        const coH = context.endHour ?? parseInt((context.accommodation.checkOutTime || "11").split(":")[0])
        checkIn.setHours(ciH, 0, 0, 0)
        checkOut.setDate(checkOut.getDate() + 1)
        checkOut.setHours(coH, 0, 0, 0)
      }

      // 쿠폰 정보 구성
      const coupons = selectedCouponId
        ? (context.rawCoupons || [])
            .filter((c) => String(c.coupon_pk) === selectedCouponId)
            .map((c) => ({
              code: c.code,
              title: c.title,
              description: c.description,
              category_code: c.category_code,
              category_description: "",
              type: c.type,
              discount_type: c.discount_type,
              discount_amount: c.discount_amount,
              total_amount: c.total_amount,
              remain_amount: c.remain_amount,
              dup_use_yn: c.dup_use_yn,
              usable_yn: c.usable_yn,
              status: c.status,
              start_dt: String(c.start_dt),
              end_dt: String(c.end_dt),
              usable_start_dt: String(c.usable_start_dt),
              usable_end_dt: String(c.usable_end_dt),
              day_codes: c.day_codes,
              constraints: c.constraints,
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

      // Step 2: PG 결제 or 현장결제
      if (paymentMethod === "card" || paymentMethod === "transfer" || paymentMethod === "phone") {
        // PG 결제: 결제 완료 정보를 sessionStorage에 저장 후 이니시스 호출
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
        localStorage.setItem("bookingResult", JSON.stringify(result))
        localStorage.setItem("pendingBookingAccommodationId", context.accommodation.id)
        localStorage.setItem("pendingBookingBookId", bookId)
        // confirmBooking 호출에 필요한 결제 정보 저장
        localStorage.setItem("pendingPaymentInfo", JSON.stringify({
          payment_pg,
          payment_method,
          price: paymentSummary.totalAmount,
          motel_key: context.accommodation.id,
          phone_number: bookerInfo.phone.replace(/-/g, ""),
          booker_name: bookerInfo.name,
        }))

        // 이니시스 결제창 호출
        setInicisParams({
          orderId: bookId,
          goodName: `${context.accommodation.name} - ${context.room.name}`,
          price: paymentSummary.totalAmount,
          buyerName: bookerInfo.name,
          buyerTel: bookerInfo.phone.replace(/-/g, ""),
          payMethod: toInicisPayMethod(paymentMethod),
        })

        setIsLoading(false)
        return // 이니시스 결제창이 열리고, 결과는 returnUrl로 처리
      }

      // 현장결제: 바로 완료
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
      router.replace(`/booking/${context.accommodation.id}/complete`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "예약 처리 중 오류가 발생했습니다"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return { submit, isLoading, error, inicisParams }
}
