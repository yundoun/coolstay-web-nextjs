export type BookingType = "rental" | "stay"

export interface BookerInfo {
  name: string
  phone: string
}

export type PaymentMethod = "onsite" | "card" | "transfer" | "phone"

export interface Coupon {
  id: string
  name: string
  discountType: "fixed" | "percent"
  discountValue: number
  minOrderAmount: number
}

export interface AgreementItem {
  id: string
  label: string
  required: boolean
  checked: boolean
}

export interface BookingContext {
  accommodation: {
    id: string
    name: string
    address: string
    checkInTime: string
    checkOutTime: string
    parkingInfo?: string
  }
  room: {
    id: string
    name: string
    imageUrl: string
    maxGuests: number
  }
  bookingType: BookingType
  price: number
  originalPrice?: number
  usageTime?: string
  availableCoupons: Coupon[]
  availableMileage: number
  benefitPointRate: number
}

export interface PaymentSummary {
  roomPrice: number
  couponDiscount: number
  mileageDiscount: number
  totalAmount: number
}

export interface BookingResult {
  bookingId: string
  accommodationName: string
  roomName: string
  bookingType: BookingType
  checkIn: string
  checkOut: string
  usageTime?: string
  bookerName: string
  bookerPhone: string
  paymentMethod: PaymentMethod
  totalAmount: number
  earnedMileage: number
}

// ─── 예약 상세 ─────────────────────────────────────────────

export interface BookingDetail {
  bookingId: string
  status: BookingStatus
  accommodationId: string
  accommodationName: string
  roomName: string
  roomImageUrl: string
  bookingType: BookingType
  checkIn: string
  checkOut: string
  usageTime?: string
  bookerName: string
  bookerPhone: string
  bookingDate: string
  transportation: string
  paymentMethod: PaymentMethod
  originalPrice: number
  coupon1Discount: number
  coupon1Name?: string
  coupon2Discount: number
  coupon2Name?: string
  mileageDiscount: number
  totalAmount: number
  hasReview: boolean
}

// ─── 예약 내역 ─────────────────────────────────────────────

export type BookingStatus =
  | "confirmed"   // 예약 완료 - 입실전 (BS001)
  | "checked_in"  // 입실 완료 (BS002)
  | "cancelled"   // 예약 취소 (BS003)
  | "processing"  // 처리중 (BS004)

export interface BookingHistoryItem {
  bookingId: string
  status: BookingStatus
  accommodationId: string
  accommodationName: string
  roomName: string
  roomImageUrl: string
  bookingType: BookingType
  checkIn: string
  checkOut: string
  usageTime?: string
  totalAmount: number
  paymentMethod: PaymentMethod
  bookerName: string
  bookerPhone: string
  createdAt: string
  hasReview: boolean
}
