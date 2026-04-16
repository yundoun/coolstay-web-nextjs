import { formatTimestampDot } from "@/lib/utils/formatDate"
import type { Review as ApiReview } from "@/lib/api/types"
import type { Review as DisplayReview } from "@/domains/accommodation/types"

/**
 * API Review → Display Review 변환
 * reg_dt는 밀리초 타임스탬프 (formatTimestampDot이 자동 판별)
 */
export function mapApiReviewToDisplay(r: ApiReview): DisplayReview {
  return {
    id: String(r.key),
    userName: r.user?.name ?? "익명",
    rating: parseFloat(r.score ?? "0"),
    content: r.text ?? "",
    createdAt: formatTimestampDot(r.reg_dt),
    roomName: r.item_description ?? "",
    isBest: r.best_yn === "Y",
    images: r.images?.map((img) => img.url).filter((u): u is string => !!u),
    reply: r.comment
      ? {
          content: r.comment.text,
          createdAt: formatTimestampDot(r.comment.reg_dt),
        }
      : undefined,
  }
}
