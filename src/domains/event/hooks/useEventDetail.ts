"use client"

import { useQuery } from "@tanstack/react-query"
import { getEventDetail } from "../api/eventApi"

export function useEventDetail(key: number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["event", "detail", key],
    queryFn: () => getEventDetail(key),
    enabled: !!key,
    retry: 1,
  })

  return {
    event: data?.board_items?.[0] ?? null,
    isLoading,
    isError,
    refetch,
  }
}
