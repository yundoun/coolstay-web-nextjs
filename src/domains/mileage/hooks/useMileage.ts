"use client"

import { useQuery } from "@tanstack/react-query"
import { getMileageDetail } from "../api/mileageApi"

export function useMileageDetail(storeKey?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mileage", storeKey],
    queryFn: () => getMileageDetail({ store_key: storeKey! }),
    enabled: !!storeKey,
    retry: 1,
  })

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "마일리지를 불러올 수 없습니다") : null,
  }
}
