import type { HttpClient } from "@/lib/ports/HttpClient"
import type { ReviewRepository, ReviewListParams } from "../ports/ReviewRepository"
import type {
  ReviewListResponse,
  ReviewRegisterRequest,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
} from "@/lib/api/types"

export class ApiReviewRepository implements ReviewRepository {
  constructor(private http: HttpClient) {}

  getReviewList(params: ReviewListParams) {
    return this.http.get<ReviewListResponse>("/contents/reviews/list", {
      ...params,
    } as Record<string, string | number | boolean | undefined>)
  }

  registerReview(body: ReviewRegisterRequest) {
    return this.http.post<void>("/contents/reviews/register", body)
  }

  updateReview(body: ReviewUpdateRequest) {
    return this.http.post<ReviewUpdateResponse>("/contents/reviews/update", body)
  }

  deleteReview(reviewKey: string) {
    return this.http.post<void>("/contents/reviews/delete", { review_key: reviewKey })
  }

  updateReviewStatus(reviewKey: string, status: string) {
    return this.http.post<void>("/contents/reviews/status/update", {
      review_key: reviewKey,
      status,
    })
  }
}
