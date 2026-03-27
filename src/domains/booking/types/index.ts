import type { BookItem } from "@/lib/api/types"

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
    packageKey?: string // 예약 API에 보낼 패키지(sub_item) 키
  }
  bookingType: BookingType
  price: number
  originalPrice?: number
  usageTime?: string
  // 시간 정보 (daily_extras에서 추출)
  startHour?: number   // 시작 가능 시간 (STIME)
  endHour?: number     // 종료 시간 (ETIME)
  useHours?: number    // 대실 이용 시간 (UTIME)
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
  couponDiscounts: { name: string; amount: number }[]
  mileageDiscount: number
  totalAmount: number
  hasReview: boolean
  refundYn: string
}

// ─── 예약 내역 ─────────────────────────────────────────────

export type BookingStatus =
  | "confirmed"   // 예약 완료 - 입실전
  | "checked_in"  // 이용 완료
  | "cancelled"   // 예약 취소
  | "processing"  // 처리중

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
  refundYn: string
}

// ─── API → 웹 타입 변환 ─────────────────────────────────────

/** API 예약 상태 → 웹 상태 */
function mapStatus(apiStatus: string): BookingStatus {
  switch (apiStatus) {
    case "CONFIRMED":
    case "READY":
      return "confirmed"
    case "USE":
      return "checked_in"
    case "REFUND":
    case "CANCELED":
      return "cancelled"
    default:
      return "processing"
  }
}

/** API 결제 수단 → 웹 결제 수단 */
function mapPaymentMethod(method?: string): PaymentMethod {
  switch (method) {
    case "CARD":
      return "card"
    case "TRANS":
    case "VBANK":
      return "transfer"
    case "PHONE":
      return "phone"
    default:
      return "onsite"
  }
}

/** Unix timestamp(ms 또는 s) → YYYY-MM-DD */
function tsToDate(ts: number): string {
  // 서버가 seconds 또는 milliseconds로 줄 수 있음
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Unix timestamp → YYYY-MM-DD HH:mm */
function tsToDateTime(ts: number): string {
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  const date = tsToDate(ts)
  const h = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${date} ${h}:${min}`
}

/** 객실 카테고리로 대실/숙박 추론 */
function inferBookingType(rooms: { category: string }[]): BookingType {
  const cat = rooms[0]?.category?.toLowerCase() || ""
  if (cat.includes("rent") || cat.includes("대실")) return "rental"
  return "stay"
}

/** 대표 이미지 URL 추출 */
function pickImageUrl(item: BookItem): string {
  if (item.itemImages?.[0]?.url) return item.itemImages[0].url
  if (item.reprImage) return item.reprImage
  if (item.motel?.images?.[0]?.url) return item.motel.images[0].url
  return ""
}

/** BookItem → BookingHistoryItem */
export function toBookingHistoryItem(b: BookItem): BookingHistoryItem {
  const bookingType = inferBookingType(b.rooms || [])
  return {
    bookingId: b.bookId,
    status: mapStatus(b.status),
    accommodationId: b.motel?.key || "",
    accommodationName: b.motel?.name || "",
    roomName: b.rooms?.[0]?.name || "",
    roomImageUrl: pickImageUrl(b),
    bookingType,
    checkIn: tsToDate(b.startDt),
    checkOut: tsToDate(b.endDt),
    usageTime: bookingType === "rental" ? undefined : undefined,
    totalAmount: b.totalPrice,
    paymentMethod: mapPaymentMethod(b.payment?.method),
    bookerName: b.name,
    bookerPhone: b.phoneNumber,
    createdAt: tsToDate(b.regDt),
    hasReview: !!b.review,
    refundYn: b.refundYn || "N",
  }
}

/** BookItem → BookingDetail */
export function toBookingDetail(b: BookItem): BookingDetail {
  const bookingType = inferBookingType(b.rooms || [])
  const couponDiscounts: { name: string; amount: number }[] = []
  if (b.usedCoupons) {
    for (const c of b.usedCoupons) {
      if (c.discount_amount > 0) {
        couponDiscounts.push({ name: c.title, amount: c.discount_amount })
      }
    }
  }

  return {
    bookingId: b.bookId,
    status: mapStatus(b.status),
    accommodationId: b.motel?.key || "",
    accommodationName: b.motel?.name || "",
    roomName: b.rooms?.[0]?.name || "",
    roomImageUrl: pickImageUrl(b),
    bookingType,
    checkIn: tsToDate(b.startDt),
    checkOut: tsToDate(b.endDt),
    bookerName: b.name,
    bookerPhone: b.phoneNumber,
    bookingDate: tsToDateTime(b.regDt),
    transportation: b.vehicleYn === "Y" ? "자가용" : "도보",
    paymentMethod: mapPaymentMethod(b.payment?.method),
    originalPrice: b.originPriceTotal,
    couponDiscounts,
    mileageDiscount: b.usedPoint,
    totalAmount: b.totalPrice,
    hasReview: !!b.review,
    refundYn: b.refundYn || "N",
  }
}
