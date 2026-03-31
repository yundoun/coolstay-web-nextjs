"use client"

import { useState, useEffect, useCallback } from "react"
import { getReviewList } from "../api/reviewApi"
import type { ReviewListResponse } from "@/lib/api/types"

export function useMyReviews() {
  const [data, setData] = useState<ReviewListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getReviewList({
        search_type: "ST302",
        search_extra: "",
        count: 20,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "리뷰를 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchList() }, [fetchList])

  return { data, isLoading, error, refresh: fetchList }
}
