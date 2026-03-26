import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getReviewList,
  registerReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  type ReviewListParams,
} from "../api/reviewApi"
import type { ReviewRegisterRequest, ReviewUpdateRequest } from "@/lib/api/types"

// 리뷰 목록 조회
export function useReviewList(params: ReviewListParams | undefined) {
  return useQuery({
    queryKey: ["contents", "reviews", params],
    queryFn: () => getReviewList(params!),
    enabled: !!params?.search_extra,
    retry: 1,
  })
}

// 리뷰 등록
export function useRegisterReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ReviewRegisterRequest) => registerReview(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents", "reviews"] })
    },
  })
}

// 리뷰 수정
export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ReviewUpdateRequest) => updateReview(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents", "reviews"] })
    },
  })
}

// 리뷰 삭제
export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewKey: string) => deleteReview(reviewKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents", "reviews"] })
    },
  })
}

// 리뷰 상태 수정
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reviewKey, status }: { reviewKey: string; status: string }) =>
      updateReviewStatus(reviewKey, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents", "reviews"] })
    },
  })
}
