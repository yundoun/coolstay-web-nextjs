"use client"

import { useState, useEffect, useCallback } from "react"
import { getEventList } from "../api/eventApi"
import type { EventBoardItem } from "../types"

export function useEventList() {
  const [events, setEvents] = useState<EventBoardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getEventList()
      setEvents(Array.isArray(res.events) ? res.events : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "이벤트를 불러올 수 없습니다")
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchList() }, [fetchList])

  return { events, isLoading, error, refresh: fetchList }
}
