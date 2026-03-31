"use client"

import { useState, useEffect, useCallback } from "react"
import { getMypageInfo } from "../api/mypageApi"
import type { MypageInfo } from "../types"

export function useMypageInfo() {
  const [info, setInfo] = useState<MypageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMypageInfo()
      setInfo(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "정보를 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { info, isLoading, error, refresh: fetch }
}
