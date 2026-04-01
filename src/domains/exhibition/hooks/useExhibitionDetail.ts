"use client"

import { useQuery } from "@tanstack/react-query"
import { getExhibitionDetail } from "../api/exhibitionApi"

export function useExhibitionDetail(key: number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exhibition", "detail", key],
    queryFn: () => getExhibitionDetail(key),
    enabled: !!key,
    retry: 1,
  })

  return {
    exhibition: data?.board_items?.[0] ?? null,
    isLoading,
    isError,
    refetch,
  }
}
