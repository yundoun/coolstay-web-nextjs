// 숙소 상세 타입 (모바일 앱 기반)
export interface AccommodationDetail {
  id: string
  name: string
  location: string
  address: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  images: string[]
  tags: string[]
  badges: string[]
  amenities: AmenityItem[]
  policies: Policy[]
  rooms: Room[]
  reviews: ReviewSummary
  bestReviews: Review[]
  events: MotelEvent[]
  parkingInfo?: string
  checkInTime: string
  checkOutTime: string
  latitude?: number
  longitude?: number
}

export interface AmenityItem {
  id: string
  name: string
  icon: string
  available: boolean
}

export interface Policy {
  title: string
  content: string
}

export interface Room {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  images: string[]
  maxGuests: number
  amenities: string[]
  isAvailable: boolean
  remainingCount: number
  keywords: string[]
}

export interface ReviewSummary {
  averageRating: number
  totalCount: number
  ratingDistribution: Record<number, number> // 5: 120, 4: 80, ...
}

export interface Review {
  id: string
  userName: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  roomName: string
  reply?: {
    content: string
    createdAt: string
  }
}

export interface MotelEvent {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: string
  endDate: string
}
