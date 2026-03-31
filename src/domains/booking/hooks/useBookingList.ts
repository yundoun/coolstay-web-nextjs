"use client"

import { useState, useEffect, useCallback } from "react"
import { getBookingList } from "../api/reservationApi"
import { toBookingHistoryItem } from "../types"
import type { BookingHistoryItem } from "../types"

type ReserveType = "ALL" | "BEFORE" | "AFTER" | "CANCEL"

export function useBookingList(reserveType: ReserveType = "ALL") {
  const [items, setItems] = useState<BookingHistoryItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async (cursor?: string, append = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getBookingList({
        search_type: "ST101",
        reserve_type: reserveType === "ALL" ? undefined : reserveType,
        count: 20,
        cursor,
      })
      const mapped = res.books.map(toBookingHistoryItem)
      setItems((prev) => (append ? [...prev, ...mapped] : mapped))
      setTotalCount(res.total_count)
      setNextCursor(res.next_cursor || undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약 목록을 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [reserveType])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const loadMore = useCallback(() => {
    if (nextCursor) {
      fetchList(nextCursor, true)
    }
  }, [nextCursor, fetchList])

  const refresh = useCallback(() => {
    fetchList()
  }, [fetchList])

  return { items, totalCount, isLoading, error, hasMore: !!nextCursor, loadMore, refresh }
}
