import type { ReviewItem, ReviewSummary } from "../types"

export const reviewSummaryMock: ReviewSummary = {
  averageRating: 4.5,
  totalReviews: 3,
  writableCount: 1,
}

export const myReviewsMock: ReviewItem[] = [
  {
    id: "rv1",
    accommodationId: "3",
    accommodationName: "세인트존스 호텔",
    roomName: "디럭스 트윈",
    roomImageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80",
    rating: 5,
    content: "강릉 여행 중 이용했는데 정말 만족스러웠습니다. 객실이 깨끗하고 바다 뷰가 정말 멋졌어요. 직원분들도 친절하시고 조식도 맛있었습니다. 다음에도 꼭 다시 방문하고 싶습니다!",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80",
    ],
    createdAt: "2026-03-12",
    bookingId: "CS2026031001",
  },
  {
    id: "rv2",
    accommodationId: "1",
    accommodationName: "파라다이스 호텔 부산",
    roomName: "스탠다드 더블",
    roomImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4,
    content: "해운대 바로 앞이라 위치가 좋았습니다. 다만 체크인 시 대기가 좀 있었어요. 수영장 시설은 깨끗하고 넓어서 좋았고, 가격 대비 만족합니다.",
    images: [],
    createdAt: "2026-02-20",
    bookingId: "CS2026021501",
  },
  {
    id: "rv3",
    accommodationId: "2",
    accommodationName: "그랜드 하얏트 제주",
    roomName: "오션뷰 디럭스",
    roomImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    rating: 4.5,
    content: "제주도 여행에서 가장 좋았던 숙소입니다. 오션뷰 방에서 보는 일출이 정말 아름다웠어요. 조식 뷔페도 종류가 다양하고 맛있었습니다.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    ],
    createdAt: "2026-01-15",
    bookingId: "CS2026011001",
  },
]
