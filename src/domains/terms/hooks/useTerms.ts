"use client"

import { useQuery } from "@tanstack/react-query"
import { getTermList } from "../api/termsApi"

export function useTerms() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["terms"],
    queryFn: () => getTermList(),
    retry: 1,
  })

  return {
    terms: data?.terms ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : "약관을 불러올 수 없습니다") : null,
  }
}
