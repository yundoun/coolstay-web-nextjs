import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getReviewList,
  registerReview,
  updateReview,
  updateReviewStatus,
  REVIEW_SEARCH_TYPE,
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

// 숙소 리뷰 목록 (커서 기반 무한 스크롤)
export function useStoreReviews(motelKey: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["contents", "reviews", "store", motelKey],
    queryFn: ({ pageParam }) => getReviewList({
      search_type: REVIEW_SEARCH_TYPE.STORE,
      search_extra: motelKey!,
      count: 20,
      cursor: pageParam as string | undefined,
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled: !!motelKey,
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

// 리뷰 삭제 (스펙상 /reviews/delete는 빈 구현 → status/update로 삭제)
export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewKey: string) => updateReviewStatus(reviewKey, "D"),
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
