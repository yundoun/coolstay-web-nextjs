export interface ReviewItem {
  id: string
  accommodationId: string
  accommodationName: string
  roomName: string
  roomImageUrl: string
  rating: number
  content: string
  images: string[]
  createdAt: string
  bookingId: string
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  writableCount: number
}
