"use client"

import { useQuery } from "@tanstack/react-query"
import { getExhibitionList } from "../api/exhibitionApi"

export function useExhibitionList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: () => getExhibitionList(),
    retry: 1,
  })

  return {
    exhibitions: data ?? [],
    isLoading,
    error: error ? "서버에 연결할 수 없습니다" : null,
  }
}
