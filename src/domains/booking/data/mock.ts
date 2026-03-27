import { getAccommodationDetail } from "@/domains/accommodation/data/mock"
import type { BookingContext, BookingType, BookingHistoryItem, BookingDetail, Coupon } from "../types"

const mockCoupons: Coupon[] = [
  {
    id: "c1",
    name: "신규회원 5,000원 할인",
    discountType: "fixed",
    discountValue: 5000,
    minOrderAmount: 50000,
  },
  {
    id: "c2",
    name: "숙박 10% 할인",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 100000,
  },
  {
    id: "c3",
    name: "주말 특가 3,000원 할인",
    discountType: "fixed",
    discountValue: 3000,
    minOrderAmount: 30000,
  },
]

export function getBookingContext(
  accommodationId: string,
  roomId: string,
  type: string
): BookingContext | null {
  const accommodation = getAccommodationDetail(accommodationId)
  if (!accommodation) return null

  const room = accommodation.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const bookingType: BookingType = type === "rental" ? "rental" : "stay"
  const isRental = bookingType === "rental"

  const price = isRental ? (room.rentalPrice || room.stayPrice) : room.stayPrice
  const originalPrice = isRental ? room.rentalOriginalPrice : room.stayOriginalPrice

  return {
    accommodation: {
      id: accommodation.id,
      name: accommodation.name,
      address: accommodation.address,
      checkInTime: accommodation.checkInTime,
      checkOutTime: accommodation.checkOutTime,
      parkingInfo: accommodation.parkingInfo,
    },
    room: {
      id: room.id,
      name: room.name,
      imageUrl: room.imageUrl,
      maxGuests: room.maxGuests,
    },
    bookingType,
    price,
    originalPrice,
    usageTime: isRental ? room.rentalTime : undefined,
    availableCoupons: mockCoupons.filter((c) => c.minOrderAmount <= price),
    availableMileage: 12000,
    benefitPointRate: accommodation.benefitPointRate,
  }
}

// ─── 예약 내역 목데이터 (API 연동 후 fallback용) ──────────────

const ROOM_IMAGE = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80"

export const bookingHistoryMock: BookingHistoryItem[] = [
  {
    bookingId: "CS2026032001",
    status: "confirmed",
    accommodationId: "1",
    accommodationName: "파라다이스 호텔 부산",
    roomName: "스탠다드 더블",
    roomImageUrl: ROOM_IMAGE,
    bookingType: "stay",
    checkIn: "2026-03-25",
    checkOut: "2026-03-26",
    totalAmount: 150000,
    paymentMethod: "card",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    createdAt: "2026-03-20",
    hasReview: false,
    refundYn: "Y",
  },
  {
    bookingId: "CS2026031501",
    status: "confirmed",
    accommodationId: "2",
    accommodationName: "그랜드 하얏트 제주",
    roomName: "오션뷰 디럭스",
    roomImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    bookingType: "stay",
    checkIn: "2026-04-01",
    checkOut: "2026-04-03",
    totalAmount: 840000,
    paymentMethod: "card",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    createdAt: "2026-03-15",
    hasReview: false,
    refundYn: "Y",
  },
  {
    bookingId: "CS2026031001",
    status: "checked_in",
    accommodationId: "3",
    accommodationName: "세인트존스 호텔",
    roomName: "디럭스 트윈",
    roomImageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80",
    bookingType: "stay",
    checkIn: "2026-03-10",
    checkOut: "2026-03-11",
    totalAmount: 198000,
    paymentMethod: "transfer",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    createdAt: "2026-03-08",
    hasReview: true,
    refundYn: "N",
  },
  {
    bookingId: "CS2026030501",
    status: "checked_in",
    accommodationId: "1",
    accommodationName: "파라다이스 호텔 부산",
    roomName: "프리미엄 스위트",
    roomImageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
    bookingType: "rental",
    checkIn: "2026-03-05",
    checkOut: "2026-03-05",
    usageTime: "최대 4시간",
    totalAmount: 50000,
    paymentMethod: "onsite",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    createdAt: "2026-03-05",
    hasReview: false,
    refundYn: "N",
  },
  {
    bookingId: "CS2026022801",
    status: "cancelled",
    accommodationId: "2",
    accommodationName: "그랜드 하얏트 제주",
    roomName: "스탠다드 킹",
    roomImageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    bookingType: "stay",
    checkIn: "2026-03-01",
    checkOut: "2026-03-02",
    totalAmount: 320000,
    paymentMethod: "card",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    createdAt: "2026-02-28",
    hasReview: false,
    refundYn: "N",
  },
]

// ─── 예약 상세 목데이터 (API 연동 후 fallback용) ──────────────

const ROOM_IMAGE_DETAIL = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"

export const bookingDetailMock: Record<string, BookingDetail> = {
  CS2026032001: {
    bookingId: "CS2026032001",
    status: "confirmed",
    accommodationId: "1",
    accommodationName: "파라다이스 호텔 부산",
    roomName: "스탠다드 더블",
    roomImageUrl: ROOM_IMAGE_DETAIL,
    bookingType: "stay",
    checkIn: "2026-03-25",
    checkOut: "2026-03-26",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    bookingDate: "2026-03-20 14:30",
    transportation: "자가용",
    paymentMethod: "card",
    originalPrice: 180000,
    couponDiscounts: [
      { name: "신규회원 할인 쿠폰", amount: 20000 },
      { name: "앱 첫결제 쿠폰", amount: 10000 },
    ],
    mileageDiscount: 0,
    totalAmount: 150000,
    hasReview: false,
    refundYn: "Y",
  },
  CS2026031001: {
    bookingId: "CS2026031001",
    status: "checked_in",
    accommodationId: "3",
    accommodationName: "세인트존스 호텔",
    roomName: "디럭스 트윈",
    roomImageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    bookingType: "stay",
    checkIn: "2026-03-10",
    checkOut: "2026-03-11",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    bookingDate: "2026-03-08 09:15",
    transportation: "도보",
    paymentMethod: "transfer",
    originalPrice: 220000,
    couponDiscounts: [
      { name: "주말 특가 쿠폰", amount: 12000 },
    ],
    mileageDiscount: 10000,
    totalAmount: 198000,
    hasReview: true,
    refundYn: "N",
  },
  CS2026030501: {
    bookingId: "CS2026030501",
    status: "checked_in",
    accommodationId: "1",
    accommodationName: "파라다이스 호텔 부산",
    roomName: "프리미엄 스위트",
    roomImageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    bookingType: "rental",
    checkIn: "2026-03-05",
    checkOut: "2026-03-05",
    usageTime: "최대 4시간",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    bookingDate: "2026-03-05 10:00",
    transportation: "자가용",
    paymentMethod: "onsite",
    originalPrice: 60000,
    couponDiscounts: [
      { name: "대실 할인 쿠폰", amount: 10000 },
    ],
    mileageDiscount: 0,
    totalAmount: 50000,
    hasReview: false,
    refundYn: "N",
  },
  CS2026022801: {
    bookingId: "CS2026022801",
    status: "cancelled",
    accommodationId: "2",
    accommodationName: "그랜드 하얏트 제주",
    roomName: "스탠다드 킹",
    roomImageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    bookingType: "stay",
    checkIn: "2026-03-01",
    checkOut: "2026-03-02",
    bookerName: "홍길동",
    bookerPhone: "010-1234-5678",
    bookingDate: "2026-02-28 16:45",
    transportation: "대중교통",
    paymentMethod: "card",
    originalPrice: 350000,
    couponDiscounts: [
      { name: "제주 특별 할인", amount: 20000 },
      { name: "앱 전용 쿠폰", amount: 10000 },
    ],
    mileageDiscount: 0,
    totalAmount: 320000,
    hasReview: false,
    refundYn: "N",
  },
}

export function getBookingDetail(bookingId: string): BookingDetail | null {
  return bookingDetailMock[bookingId] || null
}
