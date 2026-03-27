"use client"

import { useState, useEffect } from "react"
import { getBookingList, cancelBooking, hideBooking } from "../api/reservationApi"
import { toBookingDetail } from "../types"
import type { BookingDetail } from "../types"

export function useBookingDetail(bookingId: string) {
  const [detail, setDetail] = useState<BookingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      setIsLoading(true)
      setError(null)
      try {
        // ST102: 상세 조회 — search_extra에 bookId 전달
        const res = await getBookingList({
          search_type: "ST102",
          search_extra: bookingId,
          count: 1,
        })
        if (res.books.length > 0) {
          setDetail(toBookingDetail(res.books[0]))
        } else {
          setError("예약 정보를 찾을 수 없습니다")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "예약 정보를 불러올 수 없습니다")
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [bookingId])

  const cancel = async () => {
    try {
      await cancelBooking(bookingId)
      // 취소 후 상태 갱신
      if (detail) {
        setDetail({ ...detail, status: "cancelled", refundYn: "N" })
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약 취소에 실패했습니다")
      return false
    }
  }

  const hide = async () => {
    try {
      await hideBooking(bookingId, "I")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다")
      return false
    }
  }

  return { detail, isLoading, error, cancel, hide }
}
