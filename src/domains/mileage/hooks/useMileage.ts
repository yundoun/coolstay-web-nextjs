"use client"

import { useState, useEffect, useCallback } from "react"
import { getMileageDetail } from "../api/mileageApi"
import type { MileageDetailResponse } from "../types"

export function useMileageDetail(storeKey?: string) {
  const [data, setData] = useState<MileageDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!storeKey) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMileageDetail({ store_key: storeKey })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "마일리지를 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [storeKey])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error }
}
