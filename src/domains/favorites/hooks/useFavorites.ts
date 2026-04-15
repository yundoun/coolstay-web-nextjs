"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { getDibsList, registerDibs, deleteDibs } from "@/domains/mypage/api/mypageApi"
import type { StoreItem } from "@/lib/api/types"

export function useFavorites() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getDibsList({ count: 100 }),
    retry: 1,
  })

  const wishlistItems: StoreItem[] = Array.isArray(data?.motels) ? data.motels : []
  const totalCount = data?.total_count ?? 0

  const invalidateRelated = () => {
    queryClient.invalidateQueries({ queryKey: ["favorites"] })
    queryClient.invalidateQueries({ queryKey: ["contents", "detail"] })
  }

  // 찜 등록
  const registerMutation = useMutation({
    mutationFn: (motelKey: string) => registerDibs({ motel_key: motelKey }),
    onSuccess: invalidateRelated,
  })

  // 찜 삭제
  const deleteMutation = useMutation({
    mutationFn: (motelKeys: string[]) =>
      deleteDibs({
        type: "0",
        flag: "I",
        motel_keys: motelKeys.join(","),
      }),
    onSuccess: invalidateRelated,
  })

  const addFavorite = useCallback(
    (motelKey: string) => registerMutation.mutateAsync(motelKey),
    [registerMutation]
  )

  const removeFavorites = useCallback(
    (motelKeys: string[]) => deleteMutation.mutateAsync(motelKeys),
    [deleteMutation]
  )

  return {
    wishlistItems,
    totalCount,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : "찜 목록을 불러올 수 없습니다"
      : null,
    addFavorite,
    removeFavorites,
    isAdding: registerMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
