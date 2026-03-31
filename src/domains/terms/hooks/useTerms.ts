"use client"

import { useState, useEffect, useCallback } from "react"
import { getTermList } from "../api/termsApi"
import type { Term } from "../types"

export function useTerms() {
  const [terms, setTerms] = useState<Term[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTerms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTermList()
      setTerms(res.terms || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "약관을 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchTerms() }, [fetchTerms])

  return { terms, isLoading, error }
}
