"use client"

import { useQuery } from "@tanstack/react-query"
import { getTermList } from "../api/termsApi"

export function useTerms() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["terms"],
    queryFn: () => getTermList(),
    retry: 1,
  })

  // API에서 중복 code가 올 수 있으므로 첫 번째만 유지
  const uniqueTerms = (data?.terms ?? []).filter(
    (term, index, arr) => arr.findIndex((t) => t.code === term.code) === index
  )

  return {
    terms: uniqueTerms,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "약관을 불러올 수 없습니다") : null,
  }
}
