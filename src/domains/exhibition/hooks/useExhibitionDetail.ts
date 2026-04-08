"use client"

import { useQuery } from "@tanstack/react-query"
import { getExhibitionDetail } from "../api/exhibitionApi"

export function useExhibitionDetail(key: number, boardSubType: string = "EXHIBITION") {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exhibition", "detail", key, boardSubType],
    queryFn: () => getExhibitionDetail(key, boardSubType),
    enabled: !!key,
    retry: 1,
  })

  return {
    exhibition: data?.board_items?.[0] ?? null,
    sortTags: data?.sort_tags ?? [],       // result 최상위의 sort_tags
    isLoading,
    isError,
    refetch,
  }
}
