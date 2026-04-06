"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { getReviewList, REVIEW_SEARCH_TYPE } from "../api/reviewApi"

export function useMyReviews() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["myReviews"],
    queryFn: () => getReviewList({
      search_type: REVIEW_SEARCH_TYPE.MY,
      search_extra: "",
      count: 20,
    }),
    retry: 1,
  })

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["myReviews"] })
  }, [queryClient])

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "리뷰를 불러올 수 없습니다") : null,
    refresh,
  }
}
