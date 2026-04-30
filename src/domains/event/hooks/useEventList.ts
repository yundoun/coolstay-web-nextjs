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
    error: error ? "서버에 연결할 수 없습니다" : null,
  }
}
