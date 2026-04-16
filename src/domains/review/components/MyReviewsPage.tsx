"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
  Camera,
  Award,
  Loader2,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { formatTimestampDot } from "@/lib/utils/formatDate"
import { useMyReviews } from "../hooks/useMyReviews"
import {
  useUpdateReviewStatus,
  useRegisterReview,
  useUpdateReview,
} from "../hooks/useReviewData"
import type { Review, ReviewRegisterRequest, ReviewUpdateRequest } from "@/lib/api/types"

export function MyReviewsPage() {
  const { data, isLoading, error, refresh } = useMyReviews()
  const deleteReview = useUpdateReviewStatus()

  // 리뷰 작성/수정 모달 상태
  const [writeModalOpen, setWriteModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  // 삭제 확인 다이얼로그
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const reviews = data?.reviews ?? []
  const avgScore = data?.avg_score ? parseFloat(data.avg_score) : 0
  const totalCount = data?.total_count ?? 0
  const writableCount = data?.available_count ?? 0

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return
    try {
      await deleteReview.mutateAsync({
        reviewKey: String(deleteTarget),
        status: "D",
      })
      refresh()
    } catch {
      alert("삭제에 실패했습니다")
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setWriteModalOpen(true)
  }

  const handleWriteOpen = () => {
    setEditingReview(null)
    setWriteModalOpen(true)
  }

  const handleModalClose = () => {
    setWriteModalOpen(false)
    setEditingReview(null)
    refresh()
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">리뷰 관리</h1>

      {/* Summary Header */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold">{avgScore.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">평균 평점</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">작성 리뷰</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{writableCount}</p>
              <p className="text-xs text-muted-foreground">작성 가능</p>
            </div>
          </div>
        </div>
        {writableCount > 0 && (
          <Button
            className="w-full mt-4"
            onClick={handleWriteOpen}
          >
            <Pencil className="size-4 mr-2" />
            리뷰 작성하기
          </Button>
        )}
      </div>

      {/* Review List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Pencil}
          title="작성한 리뷰가 없습니다"
          description="이용한 숙소의 후기를 남겨보세요"
          action={{ label: "예약내역 보러가기", href: "/bookings" }}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.key}
              review={review}
              onDelete={() => setDeleteTarget(review.key)}
              onEdit={() => handleEdit(review)}
            />
          ))}
        </div>
      )}

      {/* Write/Edit Modal */}
      <ReviewWriteModal
        open={writeModalOpen}
        onClose={handleModalClose}
        editReview={editingReview}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제된 리뷰는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReview.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}

function ReviewCard({
  review,
  onDelete,
  onEdit,
}: {
  review: Review
  onDelete: () => void
  onEdit: () => void
}) {
  const score = parseFloat(review.score) || 0
  const motelName = review.motel?.name || ""

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Accommodation Info */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        {/* Motel thumbnail */}
        {review.motel?.images?.[0] && (review.motel.images[0].thumb_url || review.motel.images[0].url) && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image
              src={(review.motel.images[0].thumb_url || review.motel.images[0].url)!}
              alt={motelName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{motelName}</p>
            {review.best_yn === "Y" && (
              <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600 gap-1">
                <Award className="size-3" />
                베스트
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{review.item_description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4 mr-2" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="size-4 mr-2" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Review Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <StarRating rating={score} size="sm" />
          {review.user?.name && (
            <span className="text-xs font-medium text-foreground/70">{review.user.name}</span>
          )}
          <span className="text-xs text-muted-foreground">{formatTimestampDot(review.reg_dt)}</span>
          {review.status_info?.start_date && (
            <span className="text-xs text-muted-foreground">
              {formatTimestampDot(review.status_info.start_date)} 이용
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed">{review.text}</p>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {review.images.filter((img) => img.url).map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={`리뷰 이미지 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Reply */}
        {review.comment && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">사장님 답글</p>
            <p className="text-sm">{review.comment.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StarRating({
  rating,
  size = "md",
  interactive,
  onRatingChange,
}: {
  rating: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}) {
  const sizeClass = size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6"

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRatingChange?.(star)}
          className={cn(
            interactive && "cursor-pointer hover:scale-110 transition-transform"
          )}
        >
          <Star
            className={cn(
              sizeClass,
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewWriteModal({
  open,
  onClose,
  editReview,
}: {
  open: boolean
  onClose: () => void
  editReview: Review | null
}) {
  const isEditMode = !!editReview
  const registerMutation = useRegisterReview()
  const updateMutation = useUpdateReview()

  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")

  // 수정 모드일 때 기존 값으로 초기화
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && editReview) {
      setRating(parseFloat(editReview.score) || 0)
      setContent(editReview.text || "")
    } else if (isOpen) {
      setRating(0)
      setContent("")
    }
    if (!isOpen) onClose()
  }

  const isValid = rating > 0 && content.trim().length >= 10
  const isPending = registerMutation.isPending || updateMutation.isPending

  const handleSubmit = async () => {
    if (!isValid || isPending) return

    try {
      if (isEditMode) {
        const body: ReviewUpdateRequest = {
          review_key: String(editReview!.key),
          score: String(rating),
          description: content.trim(),
        }
        await updateMutation.mutateAsync(body)
      } else {
        // 작성 가능 리뷰 선택 기능은 추후 예약내역 연동 시 구현
        // 현재는 motel 정보가 없으면 작성 불가
        const body: ReviewRegisterRequest = {
          book_id: "",
          motel_key: "",
          motel_name: "",
          score: String(rating),
          description: content.trim(),
        }
        await registerMutation.mutateAsync(body)
      }
      setRating(0)
      setContent("")
      onClose()
    } catch {
      alert(isEditMode ? "수정에 실패했습니다" : "등록에 실패했습니다")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "리뷰 수정" : "리뷰 작성"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Rating */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">숙소는 어떠셨나요?</p>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium mt-1">
                {rating === 5 && "최고예요!"}
                {rating === 4 && "좋아요"}
                {rating === 3 && "보통이에요"}
                {rating === 2 && "별로예요"}
                {rating === 1 && "최악이에요"}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <Textarea
              placeholder="숙소 이용 후기를 작성해주세요 (최소 10자)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="flex justify-between mt-1">
              <p className={cn(
                "text-xs",
                content.length > 0 && content.length < 10
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}>
                {content.length > 0 && content.length < 10
                  ? "최소 10자 이상 입력해주세요"
                  : ""}
              </p>
              <p className="text-xs text-muted-foreground">{content.length}자</p>
            </div>
          </div>

          {/* Image Upload UI — GCS 업로드 미구현, 비활성 상태 */}
          <div>
            <p className="text-sm font-medium mb-2">사진 첨부</p>
            <button
              type="button"
              disabled
              className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-border opacity-50 cursor-not-allowed"
              title="사진 첨부 기능 준비중"
            >
              <Camera className="size-6 text-muted-foreground" />
            </button>
            <p className="text-xs text-muted-foreground mt-1">준비중</p>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            size="lg"
            disabled={!isValid || isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : null}
            {isEditMode ? "수정 완료" : "리뷰 등록"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
