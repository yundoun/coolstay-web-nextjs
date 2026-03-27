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
  amenities: AmenityItem[]
  policies: Policy[]
  rooms: Room[]
  reviews: ReviewSummary
  bestReview: Review | null
  recentReviews: Review[]
  events: MotelEvent[]
  parkingInfo?: string
  checkInTime: string
  checkOutTime: string
  latitude?: number
  longitude?: number
  // 모바일 앱 필드
  benefitPointRate: number // 마일리지 적립률 (5 = 5%)
  phoneNumber?: string // 전화번호 (safeNumber)
  directDiscountYn: boolean // 직접할인 쿠폰 여부
  greetingMsg?: string // 사장님 인사말
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
  imageUrl: string
  images: string[]
  maxGuests: number
  amenities: string[]
  isAvailable: boolean
  remainingCount: number
  keywords: string[]
  // 대실/숙박 구분 (모바일 앱 핵심)
  rentalPrice?: number // 대실 가격
  rentalOriginalPrice?: number
  rentalTime?: string // 대실 이용 시간 (예: "최대 3시간")
  rentalAvailable: boolean
  rentalPackageKey?: string // 대실 패키지(sub_item) 키
  rentalStartHour?: number // 대실 시작 가능 시간 (STIME)
  rentalEndHour?: number   // 대실 종료 시간 (ETIME)
  rentalUseHours?: number  // 대실 이용 시간 (UTIME)
  stayPrice: number // 숙박 가격
  stayOriginalPrice?: number
  stayAvailable: boolean
  stayPackageKey?: string // 숙박 패키지(sub_item) 키
  stayStartHour?: number  // 숙박 체크인 시간 (STIME)
  stayEndHour?: number    // 숙박 체크아웃 시간 (ETIME, 다음날)
}

export interface ReviewSummary {
  averageRating: number
  totalCount: number
  ratingDistribution: Record<number, number>
}

export interface Review {
  id: string
  userName: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  roomName: string
  isBest?: boolean
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
