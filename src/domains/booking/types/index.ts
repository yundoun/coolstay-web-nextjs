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
