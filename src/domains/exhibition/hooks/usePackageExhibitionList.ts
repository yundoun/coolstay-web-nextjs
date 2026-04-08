"use client"

import { useQuery } from "@tanstack/react-query"
import { getExhibitionDetail } from "../api/exhibitionApi"

/** 패키지 기획전 그룹의 하위 기획전 목록 조회 */
export function usePackageExhibitionList(groupKey: number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exhibition", "package", groupKey],
    queryFn: () => getExhibitionDetail(groupKey, "PACKAGE_EXHIBITION_GROUP"),
    enabled: !!groupKey,
    retry: 1,
  })

  return {
    menuTitle: data?.menu_title ?? null,
    exhibitions: data?.board_items ?? [],
    totalCount: Number(data?.total_count ?? 0),
    isLoading,
    isError,
    refetch,
  }
}
