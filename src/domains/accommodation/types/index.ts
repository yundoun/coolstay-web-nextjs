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

  // 혜택/쿠폰
  coupons: import("@/lib/api/types").Coupon[]
  benefits: { name: string; description: string; image_url?: string; active_yn: string; priority: number }[]
  downloadCouponInfo?: { status: string; coupon_avail_days: number; stay_amount: number; rent_amount: number }
  paymentBenefit?: { benefit_more_yn: string; benefit_preview?: string; benefit_contents?: string }

  // 서비스/시설
  extraServices: { code: string; name: string; visible_yn: string; image_url?: string }[]
  sitePaymentYn: string

  // 연박/특별
  consecutiveYn: string
  coolConsecutivePopup: boolean
  v2SupportFlag?: { first_reserve?: boolean; visit_korea?: boolean; low_price_korea?: boolean; favor_coupon_store?: boolean; unlimited_coupon?: boolean; revisit?: boolean; [key: string]: boolean | undefined }

  // 외부 링크
  v2ExternalLinks: { name: string; link_url: string; icon_url?: string; activate: boolean }[]
  externalEvents: import("@/lib/api/types").Banner[]

  // 숙소 정보
  likeCount: number
  userLikeYn: string
  businessInfo?: { trade_name?: string; owner_name?: string; address?: string; email?: string; phone_number?: string; business_number?: string }
  nearbyDescription?: string
  locationDescription?: string
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
  // 객실 쿠폰 (sub_items.coupons[])
  rentalCoupons?: import("@/lib/api/types").Coupon[]
  stayCoupons?: import("@/lib/api/types").Coupon[]
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
