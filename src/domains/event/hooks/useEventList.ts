"use client"

import { useQuery } from "@tanstack/react-query"
import { getEventList } from "../api/eventApi"

export function useEventList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEventList(),
    retry: 1,
  })

  return {
    events: data?.board_items ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : "이벤트를 불러올 수 없습니다") : null,
  }
}
