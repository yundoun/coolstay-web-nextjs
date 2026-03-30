import { MyReviewsPage } from "@/domains/review/components"

export function generateMetadata() {
  return {
    title: "리뷰 관리 | 꿀스테이",
  }
}

export default function ReviewsRoute() {
  return <MyReviewsPage />
}
