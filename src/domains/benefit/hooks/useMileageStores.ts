"use client"

import { useQuery } from "@tanstack/react-query"
import { getContentsList } from "@/domains/search/api/contentsApi"

const MILEAGE_SEARCH_TYPE = "ST004"

export function useMileageStores() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mileageStores"],
    queryFn: () =>
      getContentsList({
        search_type: MILEAGE_SEARCH_TYPE,
        count: 20,
      }),
    retry: 1,
  })

  return {
    stores: data?.motels ?? [],
    totalCount: data?.total_count ?? 0,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : "마일리지 정보를 불러올 수 없습니다"
      : null,
  }
}
